/* Ágora Jurídica — Radar de estágios em órgãos públicos (roda no GitHub Actions a cada 10 minutos)
   1. Descobre o Gist do portal (variável GIST_ID ou o CONFIG do index.html).
   2. Lê os dados do portal e a lista de órgãos configurada no painel.
   3. Visita a página de estágio de cada órgão (e, a cada hora, as notícias recentes),
      e publica as seleções com inscrições abertas em "Estágios, concursos e empregos" > Estágios.
   Só grava no Gist quando algo muda (ou de hora em hora, para registrar a verificação).
   Uso local: node scripts/radar-estagios.mjs  (Node 18 ou mais novo) */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buscarEstagios, mesclarEstagios, assinaturaEstagios, PADRAO_ESTAGIOS, ORGAOS_PADRAO } from '../estagios-sync.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const API = process.env.GITHUB_API || 'https://api.github.com';
const RAW = process.env.GIST_RAW || 'https://gist.githubusercontent.com';
const FILE = 'agora-dados.json';

const log = (...a) => console.log('[estágios]', ...a);
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
  const r = await fetch(API + path, { ...opt, headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'agora-juridica-radar-estagios', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(opt.body ? { 'Content-Type': 'application/json' } : {}) } });
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
  let token = process.env.GIST_TOKEN || '';
  let dados = await lerDados(G, token || null);
  if (!token) token = dec(dados.chave) || '';
  if (!token) throw new Error('O portal ainda não tem token salvo. Conclua a configuração em #/configurar ou crie o segredo GIST_TOKEN.');

  const cfg = { ...PADRAO_ESTAGIOS, ...(dados.config?.radarEstagios || {}) };
  if (cfg.ativo === false) { log('Radar de estágios desligado no painel. Nada a fazer.'); return; }
  const orgaos = Array.isArray(cfg.orgaos) && cfg.orgaos.length ? cfg.orgaos : ORGAOS_PADRAO;
  const agora = Date.now();
  const noticias = cfg.noticias !== false && (process.env.FORCAR_NOTICIAS === '1' || agora - (cfg.ultimaNoticias || 0) > 55 * 60000);

  const { itens, erros } = await buscarEstagios(orgaos, { noticias, apenasDireito: cfg.apenasDireito !== false });
  log(`Órgãos: ${orgaos.filter(o => o.ativo !== false).length} | seleções encontradas: ${itens.length}${noticias ? ' (com notícias)' : ''}${erros.length ? ' | avisos: ' + erros.join('; ') : ''}`);

  // Lê de novo logo antes de gravar, para não apagar algo que o administrador salvou nesse meio-tempo
  dados = await lerDados(G, token);
  const antes = assinaturaEstagios(dados), ult = dados.config?.radarEstagios?.ultima;
  const r = mesclarEstagios(dados, itens, { via: 'GitHub Actions', erros, orgaos, verificouNoticias: noticias, agora });
  const mudou = assinaturaEstagios(dados) !== antes;
  if (!mudou && !noticias && ult && agora - ult.em < 60 * 60000) { log('Nada novo. O portal não foi alterado.'); return; }
  await gh('/gists/' + G.id, token, { method: 'PATCH', body: JSON.stringify({ files: { [FILE]: { content: JSON.stringify(dados, null, 1) } } }) });
  log(`novas: ${r.novas} | atualizadas: ${r.atualizadas} | encerradas removidas: ${r.removidas} | abertas no portal: ${r.cfg.ultima.abertos}`);
}

main().catch(e => { console.error('[estágios] Falhou:', e.message); process.exit(1); });
