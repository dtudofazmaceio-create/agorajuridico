/* Ágora Jurídica — sincronização automática das leis (roda no GitHub Actions)
   1. Descobre o Gist do portal (variável GIST_ID ou o CONFIG do index.html).
   2. Lê os dados do portal e o token salvo pelo administrador (ou o segredo GIST_TOKEN).
   3. Consulta os Dados Abertos do Senado Federal e acrescenta as normas novas
      à seção "Atualizações da lei".
   Uso local: node scripts/sincronizar-leis.mjs  (Node 18 ou mais novo) */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buscarNormas, mesclar, PADRAO_LEIS, BASE_SENADO } from '../leis-sync.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const API = process.env.GITHUB_API || 'https://api.github.com';
const RAW = process.env.GIST_RAW || 'https://gist.githubusercontent.com';
const SENADO = process.env.SENADO_URL || BASE_SENADO;
const FILE = 'agora-dados.json';

const log = (...a) => console.log('[leis]', ...a);
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
  const r = await fetch(API + path, { ...opt, headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'agora-juridica-leis', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(opt.body ? { 'Content-Type': 'application/json' } : {}) } });
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

  const cfg = { ...PADRAO_LEIS, ...(dados.config?.leisAuto || {}) };
  if (cfg.ativo === false) { log('Sincronização desligada no painel. Nada a fazer.'); return; }

  const { normas, erros } = await buscarNormas({ tipos: cfg.tipos, base: SENADO });
  log(`Normas consultadas no Senado: ${normas.length}${erros.length ? ' | avisos: ' + erros.join('; ') : ''}`);
  if (!normas.length && erros.length) throw new Error('O portal do Senado não respondeu: ' + erros.join('; '));

  // Lê de novo logo antes de gravar, para não apagar algo que o administrador salvou nesse meio-tempo
  dados = await lerDados(G, token);
  const { novas } = mesclar(dados, normas, { via: 'GitHub Actions', erros });
  await gh('/gists/' + G.id, token, { method: 'PATCH', body: JSON.stringify({ files: { [FILE]: { content: JSON.stringify(dados, null, 1) } } }) });
  log(novas.length ? `Publicadas ${novas.length} atualização(ões):\n - ` + novas.map(p => p.titulo).join('\n - ') : 'Nenhuma norma nova.');
}

main().catch(e => { console.error('[leis] Falhou:', e.message); process.exit(1); });
