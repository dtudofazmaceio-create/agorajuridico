/* Ágora Jurídica — Radar de concursos (roda no GitHub Actions)
   1. Descobre o Gist do portal (variável GIST_ID ou o CONFIG do index.html).
   2. Lê os dados do portal e o token salvo pelo administrador (ou o segredo GIST_TOKEN).
   3. Lê as listas públicas de concursos com inscrições abertas, separa os da área jurídica
      e publica em "Estágios, concursos e empregos" > Concursos.
   Uso local: node scripts/radar-concursos.mjs  (Node 18 ou mais novo) */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buscarConcursos, mesclarConcursos, PADRAO_RADAR, FONTES_RADAR } from '../concursos-sync.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const API = process.env.GITHUB_API || 'https://api.github.com';
const RAW = process.env.GIST_RAW || 'https://gist.githubusercontent.com';
const FONTES = process.env.RADAR_FONTES ? process.env.RADAR_FONTES.split(',') : FONTES_RADAR;
const FILE = 'agora-dados.json';

const log = (...a) => console.log('[radar]', ...a);
const dec = x => { try { return x && x.startsWith('v1.') ? [...Buffer.from(x.slice(3), 'base64').toString('latin1')].reverse().join('') : null; } catch { return null; } };

async function gistDoPortal() {
  if (process.env.GIST_ID) {
    const [user, id] = process.env.GIST_ID.includes('/') ? process.env.GIST_ID.split('/') : ['', process.env.GIST_ID];
    return { user, id };
  }
  const html = await readFile(join(RAIZ, 'index.html'), 'utf8');
  const m = html.match(/gist:\s*\{\s*user:\s*'([\w-]*)'\s*,\s*id:\s*'([0-9a-f]{20,40})'/i);
  if (!m) throw new Error('Não encontrei o Gist do portal. Defina a variável GIST_ID (usuario/id) nas configurações do repositório.');
  return { user: m[1], id: m[2] };
}

async function gh(path, token, opt = {}) {
  const r = await fetch(API + path, { ...opt, headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'agora-juridica-radar', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(opt.body ? { 'Content-Type': 'application/json' } : {}) } });
  if (!r.ok) throw new Error(`GitHub ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.status === 204 ? null : r.json();
}
async function lerDados(G, token) {
  if (token) {
    const g = await gh('/gists/' + G.id, token); const f = g.files[FILE];
    if (!f) throw new Error('O Gist não tem o arquivo ' + FILE);
    return JSON.parse(f.truncated ? await (await fetch(f.raw_url)).text() : f.content);
  }
  const r = await fetch(`${RAW}/${G.user}/${G.id}/raw/${FILE}?v=${Date.now()}`);
  if (!r.ok) throw new Error('Não consegui ler os dados do portal no Gist (' + r.status + ').');
  return r.json();
}

async function main() {
  const G = await gistDoPortal();
  log('Gist do portal:', G.user ? `${G.user}/${G.id}` : G.id);
  let token = process.env.GIST_TOKEN || '';
  let dados = await lerDados(G, token || null);
  if (!token) token = dec(dados.chave) || '';
  if (!token) throw new Error('O portal ainda não tem token salvo. Conclua a configuração em #/configurar ou crie o segredo GIST_TOKEN.');

  const cfg = { ...PADRAO_RADAR, ...(dados.config?.radarConcursos || {}) };
  if (cfg.ativo === false) { log('Radar desligado no painel. Nada a fazer.'); return; }

  const { concursos, erros } = await buscarConcursos({ fontes: FONTES });
  log(`Concursos com inscrições abertas lidos: ${concursos.length}${erros.length ? ' | avisos: ' + erros.join('; ') : ''}`);
  if (!concursos.length && erros.length) {
    // registra a falha no painel e encerra com erro
    dados = await lerDados(G, token);
    dados.config = dados.config || {};
    dados.config.radarConcursos = { ...cfg, ultima: { em: Date.now(), via: 'GitHub Actions', encontrados: 0, relevantes: 0, novas: 0, atualizadas: 0, removidas: 0, abertos: (dados.publicacoes || []).filter(p => p.radar).length, erros: erros.slice(0, 8) } };
    await gh('/gists/' + G.id, token, { method: 'PATCH', body: JSON.stringify({ files: { [FILE]: { content: JSON.stringify(dados, null, 1) } } }) });
    throw new Error('As fontes de concursos não responderam: ' + erros.join('; '));
  }

  // Lê de novo logo antes de gravar, para não apagar algo que o administrador salvou nesse meio-tempo
  dados = await lerDados(G, token);
  const r = mesclarConcursos(dados, concursos, { via: 'GitHub Actions', erros });
  await gh('/gists/' + G.id, token, { method: 'PATCH', body: JSON.stringify({ files: { [FILE]: { content: JSON.stringify(dados, null, 1) } } }) });
  log(`Área jurídica: ${r.cfg.ultima.relevantes} | novos: ${r.novas} | atualizados: ${r.atualizadas} | encerrados removidos: ${r.removidas} | abertos no portal: ${r.cfg.ultima.abertos}`);
}

main().catch(e => { console.error('[radar] Falhou:', e.message); process.exit(1); });
