/* =====================================================================
   Ágora Jurídica — ponte de contas (Cloudflare Worker, plano gratuito)

   Guarda as contas dos alunos num Gist SECRETO separado (agora-contas.json),
   que só esta ponte lê e grava. Assim:
   - o aluno entra com o mesmo e-mail e senha em qualquer aparelho;
   - o mesmo e-mail não pode ser cadastrado duas vezes;
   - o período grátis, os códigos resgatados e a validade da assinatura
     ficam na nuvem e não se perdem ao trocar de celular;
   - o token do GitHub nunca vai para o navegador dos alunos.

   Variáveis (Workers → Settings → Variables and Secrets):
     GITHUB_TOKEN     (secreta) token classic do GitHub com a permissão "gist",
                      da MESMA conta dona do Gist de conteúdo.
     CONTENT_GIST_ID  ID do Gist de conteúdo do portal (agora-dados.json).
     SESSION_SECRET   (secreta, recomendada) qualquer texto longo e aleatório.
     ALLOWED_ORIGIN   (opcional) endereço do site, ex.: https://usuario.github.io
     USERS_GIST_ID    (opcional) ID do Gist de contas. Se ficar vazio, a ponte
                      procura ou cria sozinha um Gist secreto "agora-contas.json".
   ===================================================================== */

const GH = 'https://api.github.com';
const USERS_FILE = 'agora-contas.json';
const CONTENT_FILE = 'agora-dados.json';
const DAY = 86400000;
const PBKDF2_IT = 100000;            // limite do Cloudflare Workers
const SESSAO_DIAS = 90;
const CAMPOS_PERFIL = ['nome', 'telefone', 'instituicao', 'semestre'];

let usersGistId = null;             // cache em memória (por instância)
let donoToken = null;

/* ----------------------------- utilidades ----------------------------- */
const enc = new TextEncoder();
const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
const b64u = s => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = s => atob(s.replace(/-/g, '+').replace(/_/g, '/'));
const uid = () => crypto.randomUUID();
const normEmail = e => String(e || '').trim().toLowerCase();
const normCode = c => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const limpa = (v, n = 160) => String(v ?? '').trim().slice(0, n);

class Erro extends Error { constructor(status, msg) { super(msg); this.status = status; } }

function cors(env, req) {
  const o = req.headers.get('Origin') || '';
  const permitido = !env.ALLOWED_ORIGIN || env.ALLOWED_ORIGIN.split(',').map(s => s.trim()).includes(o);
  return {
    'Access-Control-Allow-Origin': permitido ? (o || '*') : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-GitHub-Token',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}
const json = (env, req, body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors(env, req) } });

async function sha256(txt) { return hex(await crypto.subtle.digest('SHA-256', enc.encode(txt))); }
async function pbkdf2(senha, salt, it = PBKDF2_IT) {
  const k = await crypto.subtle.importKey('raw', enc.encode(senha), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: it }, k, 256));
}
function igual(a, b) { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }
async function novaSenha(senha) { const salt = uid(); return { alg: 'pbkdf2-sha256', it: PBKDF2_IT, salt, hash: await pbkdf2(senha, salt) }; }
async function confere(senha, s) { return !!s && igual(await pbkdf2(senha, s.salt, s.it || PBKDF2_IT), s.hash); }

/* ------------------------------ sessões ------------------------------ */
async function chaveSessao(env) {
  const seg = env.SESSION_SECRET || ('derivada:' + env.GITHUB_TOKEN);
  return crypto.subtle.importKey('raw', enc.encode(seg), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
async function assinar(env, payload) {
  const corpo = b64u(JSON.stringify(payload));
  const sig = await crypto.subtle.sign('HMAC', await chaveSessao(env), enc.encode(corpo));
  return corpo + '.' + b64u(String.fromCharCode(...new Uint8Array(sig)));
}
async function lerSessao(env, req) {
  const h = req.headers.get('Authorization') || '';
  const tok = h.startsWith('Bearer ') ? h.slice(7) : '';
  const [corpo, sig] = tok.split('.');
  if (!corpo || !sig) throw new Erro(401, 'Sessão expirada. Entre novamente.');
  const ok = await crypto.subtle.verify('HMAC', await chaveSessao(env), Uint8Array.from(unb64u(sig), c => c.charCodeAt(0)), enc.encode(corpo));
  if (!ok) throw new Erro(401, 'Sessão inválida. Entre novamente.');
  const p = JSON.parse(unb64u(corpo));
  if (!p.exp || p.exp < Date.now()) throw new Erro(401, 'Sessão expirada. Entre novamente.');
  return p;
}
const emitir = (env, u) => assinar(env, { uid: u.id, pv: u.pv || 0, exp: Date.now() + SESSAO_DIAS * DAY });

/* ------------------------------ GitHub ------------------------------ */
async function gh(env, path, opt = {}, token = env.GITHUB_TOKEN) {
  const r = await fetch(GH + path, {
    ...opt,
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'agora-juridica-contas', Authorization: 'Bearer ' + token, ...(opt.body ? { 'Content-Type': 'application/json' } : {}) }
  });
  if (!r.ok) {
    if (r.status === 401) throw new Erro(502, 'O token do GitHub configurado na ponte é inválido ou expirou.');
    if (r.status === 404) throw new Erro(502, 'Gist não encontrado ou sem permissão.');
    throw new Erro(502, 'O GitHub recusou a operação (' + r.status + '). Tente de novo em instantes.');
  }
  return r.status === 204 ? null : r.json();
}
async function conteudoArquivo(f) { return f.truncated ? (await fetch(f.raw_url)).text() : f.content; }
async function dono(env) {
  if (!donoToken) donoToken = (await gh(env, '/user')).login.toLowerCase();
  return donoToken;
}
async function idContas(env) {
  if (env.USERS_GIST_ID) return env.USERS_GIST_ID;
  if (usersGistId) return usersGistId;
  for (let p = 1; p <= 20; p++) {
    const l = await gh(env, `/gists?per_page=100&page=${p}`);
    const g = l.find(x => x.files && x.files[USERS_FILE]);
    if (g) return (usersGistId = g.id);
    if (l.length < 100) break;
  }
  const g = await gh(env, '/gists', { method: 'POST', body: JSON.stringify({
    description: 'Ágora Jurídica — contas dos alunos (privado, não apague)', public: false,
    files: { [USERS_FILE]: { content: JSON.stringify({ versao: 2, aviso: 'As contas ficam nos arquivos contas-XX.json deste Gist.' }) } } }) });
  return (usersGistId = g.id);
}
/* As contas são divididas em até 256 arquivos (contas-00.json … contas-ff.json) pelo início do
   hash do e-mail. Gravar um arquivo não mexe nos outros, então cadastros simultâneos de alunos
   diferentes quase nunca se cruzam; e cada gravação é conferida e repetida se for preciso. */
const fatia = async email => (await sha256(normEmail(email))).slice(0, 2);
const arqFatia = f => `contas-${f}.json`;
const fatiaDoId = id => (String(id).match(/^([0-9a-f]{2})-/) || [])[1];
async function lerGist(env) { return gh(env, '/gists/' + await idContas(env)); }
async function lerFatia(env, f, g) {
  g = g || await lerGist(env);
  const a = g.files[arqFatia(f)];
  const d = a ? JSON.parse(await conteudoArquivo(a)) : {};
  d.usuarios = d.usuarios || {};
  return d;
}
async function lerTodas(env) {
  const g = await lerGist(env), out = [];
  for (const nome of Object.keys(g.files)) {
    const m = nome.match(/^contas-([0-9a-f]{2})\.json$/); if (!m) continue;
    out.push(...Object.values((await lerFatia(env, m[1], g)).usuarios));
  }
  return out;
}
async function gravarFatia(env, f, d) {
  await gh(env, '/gists/' + await idContas(env), { method: 'PATCH', body: JSON.stringify({ files: { [arqFatia(f)]: { content: JSON.stringify(d) } } }) });
}
/* fn(d) altera a fatia e devolve o registro alterado (ou null quando apaga `apagar`). */
async function alterar(env, f, fn, { apagar = null, unico = null } = {}) {
  for (let t = 0; t < 5; t++) {
    const d = await lerFatia(env, f);
    const r = await fn(d);
    const rev = uid();
    if (r) r.rev = rev;
    await gravarFatia(env, f, d);
    const v = await lerFatia(env, f);
    const ok = apagar ? !v.usuarios[apagar] : v.usuarios[r.id]?.rev === rev && (!unico || porEmail(v, unico)?.id === r.id);
    if (ok) return r;
    await new Promise(s => setTimeout(s, 250 + Math.random() * 750));
  }
  throw new Erro(503, 'Muitos acessos ao mesmo tempo. Tente novamente em alguns segundos.');
}
async function conteudo(env) {
  if (!env.CONTENT_GIST_ID) return { config: {}, codigos: [] };
  const g = await gh(env, '/gists/' + env.CONTENT_GIST_ID);
  const f = g.files[CONTENT_FILE];
  return f ? JSON.parse(await conteudoArquivo(f)) : { config: {}, codigos: [] };
}

/* ------------------------------ regras ------------------------------ */
const publico = u => { if (!u) return null; const { senha, pv, rev, ...r } = u; return r; };
const porEmail = (d, e) => Object.values(d.usuarios || {}).find(u => u.email === e);
function estender(u, dias, plano) {
  const a = u.assinatura, vigente = a?.status === 'ativa' && a.validade > Date.now();
  u.assinatura = { status: 'ativa', tipo: 'pago', plano: plano || '', inicio: vigente ? a.inicio : Date.now(), validade: (vigente ? a.validade : Date.now()) + dias * DAY };
}
function validaCadastro(b) {
  const email = normEmail(b.email), nome = limpa(b.nome, 120), senha = String(b.senha || '');
  if (!nome) throw new Erro(400, 'Informe o nome completo.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) throw new Erro(400, 'E-mail inválido.');
  if (senha.length < 6 || senha.length > 200) throw new Erro(400, 'A senha deve ter pelo menos 6 caracteres.');
  return { email, nome, senha };
}
async function exigirAdmin(env, req) {
  const t = req.headers.get('X-GitHub-Token') || '';
  if (!t) throw new Erro(401, 'Entre como administrador.');
  let u;
  try { u = await gh(env, '/user', {}, t); } catch { throw new Erro(401, 'Token do administrador inválido ou expirado.'); }
  if (u.login.toLowerCase() !== await dono(env)) throw new Erro(403, 'Este token não é da conta dona do portal.');
}
async function usuarioDaSessao(env, req, d) {
  const s = await lerSessao(env, req);
  d = d || await lerFatia(env, fatiaDoId(s.uid));
  const u = d.usuarios[s.uid];
  if (!u || (u.pv || 0) !== (s.pv || 0)) throw new Erro(401, 'Sessão expirada. Entre novamente.');
  return u;
}
async function fatiaSessao(env, req) {
  const s = await lerSessao(env, req), f = fatiaDoId(s.uid);
  if (!f) throw new Erro(401, 'Sessão inválida. Entre novamente.');
  return f;
}

/* ------------------------------ rotas ------------------------------ */
async function rota(req, env) {
  const url = new URL(req.url), m = req.method;
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const body = m === 'POST' || m === 'PATCH' ? await req.json().catch(() => ({})) : {};

  if (path === '/' || path === '/ping') return { ok: true, servico: 'agora-contas', versao: 1, conteudo: !!env.CONTENT_GIST_ID, conteudoId: env.CONTENT_GIST_ID || '' };

  if (path === '/cadastro' && m === 'POST') {
    const { email, nome, senha } = validaCadastro(body);
    const cfg = (await conteudo(env)).config || {};
    const dt = Math.max(0, Number(cfg.diasTeste) || 0);
    const senhaRec = await novaSenha(senha), f = await fatia(email), id = f + '-' + uid();
    const u = await alterar(env, f, d => {
      const ja = porEmail(d, email);
      if (ja && ja.id !== id) throw new Erro(409, 'Este e-mail já está cadastrado. Use “Entrar” com a sua senha.');
      const n = ja || { id, nome, email, telefone: limpa(body.telefone, 40), instituicao: limpa(body.instituicao), semestre: limpa(body.semestre, 40),
        role: 'aluno', criadoEm: Date.now(), assinatura: dt ? { status: 'ativa', tipo: 'teste', inicio: Date.now(), validade: Date.now() + dt * DAY } : null,
        codigosUsados: [], senha: senhaRec, pv: 0 };
      d.usuarios[id] = n; return n;
    }, { unico: email });
    return { token: await emitir(env, u), user: publico(u) };
  }

  if (path === '/entrar' && m === 'POST') {
    const email = normEmail(body.email);
    const u = porEmail(await lerFatia(env, await fatia(email)), email);
    if (!u || !await confere(String(body.senha || ''), u.senha)) throw new Erro(401, 'E-mail ou senha incorretos.');
    return { token: await emitir(env, u), user: publico(u) };
  }

  /* Conta criada antes só no aparelho: vai para a nuvem uma única vez, mantendo a assinatura. */
  if (path === '/migrar' && m === 'POST') {
    const { email, nome, senha } = validaCadastro(body);
    const f = await fatia(email), id = f + '-' + uid();
    const existente = porEmail(await lerFatia(env, f), email);
    if (existente) {
      if (!await confere(senha, existente.senha)) throw new Erro(401, 'E-mail ou senha incorretos.');
      return { token: await emitir(env, existente), user: publico(existente) };
    }
    const a = body.assinatura;
    const assin = a && a.validade ? { status: a.status === 'cancelada' ? 'cancelada' : 'ativa', tipo: a.tipo === 'teste' ? 'teste' : 'pago', plano: limpa(a.plano, 60),
      inicio: Number(a.inicio) || Date.now(), validade: Math.min(Number(a.validade) || 0, Date.now() + 400 * DAY) } : null;
    const senhaRec = await novaSenha(senha);
    const u = await alterar(env, f, d => {
      const ja = porEmail(d, email);
      if (ja && ja.id !== id) throw new Erro(409, 'Este e-mail já está cadastrado. Use “Entrar” com a sua senha.');
      const n = ja || { id, nome, email, telefone: limpa(body.telefone, 40), instituicao: limpa(body.instituicao), semestre: limpa(body.semestre, 40),
        role: 'aluno', criadoEm: Number(body.criadoEm) || Date.now(), assinatura: assin,
        codigosUsados: Array.isArray(body.codigosUsados) ? body.codigosUsados.slice(0, 200).map(String) : [], senha: senhaRec, pv: 0, migrado: Date.now() };
      d.usuarios[id] = n; return n;
    }, { unico: email });
    return { token: await emitir(env, u), user: publico(u) };
  }

  if (path === '/eu' && m === 'GET') return { user: publico(await usuarioDaSessao(env, req)) };

  if (path === '/eu' && m === 'PATCH') {
    const u = await alterar(env, await fatiaSessao(env, req), async d => {
      const x = await usuarioDaSessao(env, req, d);
      for (const k of CAMPOS_PERFIL) if (k in body) x[k] = limpa(body[k], k === 'nome' ? 120 : 160);
      if (!x.nome) throw new Erro(400, 'Informe o nome completo.');
      return x;
    });
    return { user: publico(u) };
  }

  if (path === '/eu/senha' && m === 'POST') {
    const nova = String(body.nova || '');
    if (nova.length < 6) throw new Erro(400, 'A nova senha deve ter pelo menos 6 caracteres.');
    const rec = await novaSenha(nova);
    const u = await alterar(env, await fatiaSessao(env, req), async d => {
      const x = await usuarioDaSessao(env, req, d);
      if (!await confere(String(body.atual || ''), x.senha)) throw new Erro(400, 'A senha atual está incorreta.');
      x.senha = rec; x.pv = (x.pv || 0) + 1; return x;   // encerra as sessões nos outros aparelhos
    });
    return { token: await emitir(env, u), user: publico(u) };
  }

  if (path === '/resgatar' && m === 'POST') {
    const code = normCode(body.codigo);
    if (!code) throw new Erro(400, 'Digite o código.');
    const h = await sha256('agora-codigo:' + code);
    const ct = await conteudo(env);
    const c = (ct.codigos || []).find(x => x.hash === h);
    if (!c) throw new Erro(400, 'Código inválido. Confira as letras e números.');
    if (c.validoAte && new Date(c.validoAte + 'T23:59:59') < Date.now()) throw new Erro(400, 'Este código expirou. Peça um novo ao administrador.');
    const pl = (ct.config?.planos || [])[0];
    const dias = Number(c.dias) || Number(pl?.dias) || 30;
    let jaUsado = false;
    const u = await alterar(env, await fatiaSessao(env, req), async d => {
      const x = await usuarioDaSessao(env, req, d);
      x.codigosUsados = x.codigosUsados || [];
      if (x.codigosUsados.includes(c.id)) { jaUsado = true; return x; }
      estender(x, dias, c.plano || '');
      x.codigosUsados.push(c.id);
      return x;
    });
    if (jaUsado) throw new Erro(400, 'Você já usou este código.');
    return { user: publico(u), codigo: { dias, plano: c.plano || '' } };
  }

  /* ----------------------------- administrador ----------------------------- */
  if (path === '/admin/usuarios' && m === 'GET') {
    await exigirAdmin(env, req);
    return { usuarios: (await lerTodas(env)).map(publico) };
  }
  const ma = path.match(/^\/admin\/usuarios\/([\w-]+)(\/senha)?$/);
  if (ma) {
    await exigirAdmin(env, req);
    const id = ma[1], f = fatiaDoId(id);
    if (!f) throw new Erro(404, 'Aluno não encontrado.');
    const pega = d => { const x = d.usuarios[id]; if (!x) throw new Erro(404, 'Aluno não encontrado.'); return x; };
    if (ma[2] && m === 'POST') {
      const nova = String(body.senha || '');
      if (nova.length < 6) throw new Erro(400, 'A senha deve ter pelo menos 6 caracteres.');
      const rec = await novaSenha(nova);
      const u = await alterar(env, f, d => { const x = pega(d); x.senha = rec; x.pv = (x.pv || 0) + 1; return x; });
      return { user: publico(u) };
    }
    if (!ma[2] && m === 'PATCH') {
      const u = await alterar(env, f, d => {
        const x = pega(d);
        if (body.acao === 'ativar') estender(x, Math.max(1, Number(body.dias) || 30), limpa(body.plano, 60));
        else if (body.acao === 'cancelar') x.assinatura = { ...(x.assinatura || {}), status: 'cancelada', validade: Date.now() };
        else if (body.assinatura !== undefined) x.assinatura = body.assinatura;
        for (const k of CAMPOS_PERFIL) if (k in body) x[k] = limpa(body[k]);
        return x;
      });
      return { user: publico(u) };
    }
    if (!ma[2] && m === 'DELETE') {
      await alterar(env, f, d => { pega(d); delete d.usuarios[id]; return null; }, { apagar: id });
      return { ok: true };
    }
  }
  throw new Erro(404, 'Rota não encontrada.');
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(env, req) });
    if (!env.GITHUB_TOKEN) return json(env, req, { erro: 'A ponte ainda não tem o GITHUB_TOKEN configurado.' }, 500);
    try { return json(env, req, await rota(req, env)); }
    catch (e) {
      const st = e instanceof Erro ? e.status : 500;
      if (st === 500) console.error(e);
      return json(env, req, { erro: e instanceof Erro ? e.message : 'Erro interno na ponte de contas.' }, st);
    }
  }
};
