/* Ágora Jurídica — Radar de estágios em órgãos públicos
   Acompanha as páginas oficiais de estágio dos órgãos cadastrados no painel (TJAL, MPAL, MPF,
   Defensoria, Justiça Federal, TRT, TRE, Procuradorias…) e as notícias recentes sobre seleções
   de estagiários desses órgãos. Cada seleção com inscrições abertas vira uma publicação em
   "Estágios, concursos e empregos" > Estágios, com o prazo e o link da fonte.
   Usado pelo GitHub Actions (scripts/radar-estagios.mjs), a cada 10 minutos. */
import { textoLimpo } from './concursos-sync.mjs';

/* Órgãos sugeridos (Alagoas). O administrador edita a lista no painel. */
export const ORGAOS_PADRAO = [
  { id: 'tjal', sigla: 'TJAL', nome: 'Tribunal de Justiça de Alagoas', uf: 'AL', url: 'https://estagioesmal.tjal.jus.br/', busca: 'estágio TJAL OR Esmal', ativo: true },
  { id: 'mpal', sigla: 'MPAL', nome: 'Ministério Público de Alagoas', uf: 'AL', url: 'https://www.mpal.mp.br/', busca: 'estágio MPAL OR "Ministério Público de Alagoas"', ativo: true },
  { id: 'mpf-al', sigla: 'MPF/AL', nome: 'Ministério Público Federal em Alagoas', uf: 'AL', url: 'https://www.mpf.mp.br/al/estagie-conosco', busca: 'estágio "MPF" Alagoas', ativo: true },
  { id: 'dpe-al', sigla: 'DPE/AL', nome: 'Defensoria Pública de Alagoas', uf: 'AL', url: 'https://www.defensoria.al.def.br/', busca: 'estágio "Defensoria Pública" Alagoas', ativo: true },
  { id: 'dpu-al', sigla: 'DPU/AL', nome: 'Defensoria Pública da União em Alagoas', uf: 'AL', url: '', busca: 'estágio DPU Alagoas', ativo: true },
  { id: 'jfal', sigla: 'JFAL', nome: 'Justiça Federal em Alagoas', uf: 'AL', url: 'https://www.jfal.jus.br/', busca: 'estágio JFAL OR "Justiça Federal em Alagoas"', ativo: true },
  { id: 'trt19', sigla: 'TRT19', nome: 'Tribunal Regional do Trabalho da 19ª Região', uf: 'AL', url: 'https://site.trt19.jus.br/', busca: 'estágio TRT19 OR "TRT da 19ª"', ativo: true },
  { id: 'tre-al', sigla: 'TRE-AL', nome: 'Tribunal Regional Eleitoral de Alagoas', uf: 'AL', url: 'https://www.tre-al.jus.br/', busca: 'estágio "TRE-AL" OR "TRE de Alagoas"', ativo: true },
  { id: 'pge-al', sigla: 'PGE/AL', nome: 'Procuradoria-Geral do Estado de Alagoas', uf: 'AL', url: 'https://www.procuradoria.al.gov.br/', busca: 'estágio "PGE" Alagoas OR "Procuradoria-Geral do Estado de Alagoas"', ativo: true },
  { id: 'pgm-maceio', sigla: 'PGM Maceió', nome: 'Procuradoria-Geral do Município de Maceió', uf: 'AL', url: '', busca: 'estágio "Procuradoria-Geral do Município de Maceió" OR "PGM Maceió"', ativo: true }
];
export const PADRAO_ESTAGIOS = { ativo: true, apenasDireito: true, noticias: true, orgaos: null, ignorados: [], vistos: {}, ultima: null, ultimaNoticias: 0 };

const EST = /est[aá]gi(o|os|[aá]ri[oa]s?)\b/i;
const POSITIVO = /inscri[çc][õo]es|inscreva|abert[ao]s?\b|abre\b|lan[çc]a|sele[çc][ãa]o|seletivo|edital( n[ºo°.]*\s*\d+)?( de)? abertura|cadastro de? reserva|vagas?\b|oportunidade/i;
const NEGATIVO = /resultado|convoca|homolog|gabarito|classifica[çc][ãa]o|aprovad|recurso|retifica|lista de|rela[çc][ãa]o de|heteroidentifica|per[íi]cia|treinamento|termo de|ratifica|prorroga|suspens|cancelad|desligamento|frequ[êe]ncia|folha de|pagamento|contrato n|licita|preg[ãa]o|nomea|posse\b|bolsa aux[íi]lio reajust|encerrad/i;
const OUTRO_CURSO = /administra[çc][ãa]o|cont[áa]b|biblioteconomia|jornalismo|comunica[çc][ãa]o social|psicologia|servi[çc]o social|engenharia|arquitetura|inform[áa]tica|tecnologia da informa|ci[êe]ncia da computa|sistemas de informa|medicina|enfermagem|odontologia|nutri[çc][ãa]o|letras|pedagogia|economia|estat[íi]stica|design|publicidade|ensino m[ée]dio|n[íi]vel m[ée]dio|t[ée]cnico em/i;
const DIREITO = /direito|jur[íi]dic|bacharel/i;
const MESES = { janeiro: 1, fevereiro: 2, 'março': 3, marco: 3, abril: 4, maio: 5, junho: 6, julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12 };
const p2 = n => String(n).padStart(2, '0');

/* Datas citadas num trecho: 22/03/2026, 22/03/26, 22.03.2026, "22 de março de 2026", "22 de março" */
export function datasDoTexto(txt, anoRef = new Date().getFullYear()) {
  const out = [];
  for (const m of String(txt).matchAll(/\b(\d{1,2})[/.](\d{1,2})[/.](\d{2,4})\b/g)) {
    let [d, mm, a] = [+m[1], +m[2], +m[3]]; if (a < 100) a += 2000;
    if (d >= 1 && d <= 31 && mm >= 1 && mm <= 12 && a > 2000) out.push(`${a}-${p2(mm)}-${p2(d)}`);
  }
  for (const m of String(txt).matchAll(/\b(\d{1,2})º?\s+de\s+(janeiro|fevereiro|mar[çc]o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?:\s+de\s+(\d{4}))?/gi)) {
    const mm = MESES[m[2].toLowerCase()] || MESES[m[2].toLowerCase().replace('ç', 'c')]; const d = +m[1];
    if (mm && d >= 1 && d <= 31) out.push(`${m[3] || anoRef}-${p2(mm)}-${p2(d)}`);
  }
  return [...new Set(out)].sort();
}

/* É anúncio de seleção de estágio (e não resultado, convocação, outro curso…)? */
export function ehSelecaoEstagio(txt, { apenasDireito = true } = {}) {
  const t = String(txt || '');
  if (!EST.test(t) || !POSITIVO.test(t) || NEGATIVO.test(t)) return false;
  if (apenasDireito && OUTRO_CURSO.test(t) && !DIREITO.test(t)) return false;
  return true;
}

const absoluta = (href, base) => { try { const u = new URL(String(href).replace(/&amp;/g, '&'), base); return /^https?:$/.test(u.protocol) ? u.href : ''; } catch { return ''; } };
const limpaHTML = h => String(h || '')
  .replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style|noscript|svg|iframe|form|select)\b[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<(nav|header|footer)\b[\s\S]*?<\/\1>/gi, ' ');

/* Lê a página de um órgão e devolve as seleções de estágio encontradas.
   A página é dividida em blocos (itens de lista, linhas de tabela, parágrafos, títulos, cards).
   Um bloco que anuncia seleção de estágio vira um item; se ele não traz datas, as datas de
   inscrição dos blocos logo abaixo (como nas listas de editais) são usadas. */
export function extrairEstagiosPagina(html, orgao, { hoje = new Date().toISOString().slice(0, 10), apenasDireito = true } = {}) {
  const base = orgao.url, ano = +hoje.slice(0, 4);
  const blocos = limpaHTML(html).split(/<\/(?:li|tr|p|h[1-6]|article|dt|dd|td)>|<br\s*\/?>|<(?:li|tr|p|h[1-6]|article|dt|dd)\b[^>]*>|<div[^>]*class=["'][^"']*(?:card|item|noticia|news|post|entry|listing|resultado|concurso)[^"']*["'][^>]*>/i)
    .map(h => ({ h, t: textoLimpo(h) })).filter(b => b.t && b.t.length > 3);
  const itens = [];
  for (let i = 0; i < blocos.length; i++) {
    const { h, t } = blocos[i];
    if (t.length > 600 || !ehSelecaoEstagio(t, { apenasDireito })) continue;
    let datas = datasDoTexto(t, ano), extra = '', hExtra = '';
    if (!datas.length) {
      const ext = [];
      for (let j = i + 1; j < Math.min(blocos.length, i + 10); j++) {
        const tj = blocos[j].t;
        if ((EST.test(tj) && POSITIVO.test(tj) && !/inscri/i.test(tj)) || /em andamento|encerrad|anteriores|conclu[íi]d/i.test(tj)) break;
        if (/inscri|prazo|per[íi]odo/i.test(tj)) { const dj = datasDoTexto(tj, ano); if (dj.length) { datas.push(...dj); ext.push(tj); hExtra += blocos[j].h; } }
      }
      datas = [...new Set(datas)].sort(); extra = ext.slice(-2).join(' · ');
    }
    const fim = datas[datas.length - 1] || '';
    if (fim && fim < hoje) continue; // inscrições já encerradas
    if (!fim && !/abert|inscri[çc][õo]es|inscreva/i.test(t)) continue; // sem data e sem sinal de inscrição aberta: provavelmente um menu
    const links = [...(h + hExtra).matchAll(/<a\b[^>]*href=["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m => ({ href: absoluta(m[1], base), t: textoLimpo(m[2]) })).filter(l => l.href);
    const link = (links.find(l => EST.test(l.t) || /edital|inscri/i.test(l.t)) || links[0] || {}).href || base;
    itens.push({ titulo: t.slice(0, 240), texto: [t, extra].filter(Boolean).join(' · ').slice(0, 900), fim, link, orgao: orgao.id, oficial: true, fonte: `Página oficial ${orgao.sigla}` });
  }
  const vistos = new Set();
  return itens.filter(x => { const k = x.titulo.toLowerCase(); if (vistos.has(k)) return false; vistos.add(k); return true; });
}

/* Notícias recentes (Google Notícias, RSS) sobre seleções de estagiários do órgão */
export const urlNoticias = o => `https://news.google.com/rss/search?q=${encodeURIComponent(`(${o.busca || `estágio "${o.sigla}"`}) when:20d`)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
export function extrairEstagiosNoticias(xml, orgao, { hoje = new Date().toISOString().slice(0, 10), apenasDireito = true, diasMax = 20 } = {}) {
  const itens = [], corte = new Date(Date.parse(hoje) - diasMax * 86400000).toISOString().slice(0, 10);
  const nomes = [orgao.sigla, ...(orgao.sigla.includes('/') ? [orgao.sigla.split('/')[0]] : []), orgao.nome].filter(Boolean).map(s => s.toLowerCase());
  for (const m of String(xml || '').matchAll(/<item>([\s\S]*?)<\/item>/gi)) {
    const it = m[1], tag = n => textoLimpo(((it.match(new RegExp(`<${n}[^>]*>([\\s\\S]*?)<\\/${n}>`, 'i')) || [])[1] || '').replace(/^<!\[CDATA\[|\]\]>$/g, ''));
    let titulo = tag('title'); const fonte = tag('source'), desc = tag('description');
    if (fonte && titulo.endsWith(' - ' + fonte)) titulo = titulo.slice(0, -(fonte.length + 3));
    const pub = new Date(tag('pubDate')); if (isNaN(pub)) continue;
    const pubISO = pub.toISOString().slice(0, 10); if (pubISO < corte) continue;
    const txt = `${titulo} ${desc}`;
    if (!ehSelecaoEstagio(titulo, { apenasDireito })) continue;
    if (!nomes.some(n => txt.toLowerCase().includes(n))) continue;
    const datas = datasDoTexto(txt, pub.getFullYear()).filter(d => d >= pubISO);
    const fim = datas[datas.length - 1] || '';
    if (fim && fim < hoje) continue;
    const link = absoluta(tag('link'), 'https://news.google.com/'); if (!link) continue;
    itens.push({ titulo: titulo.slice(0, 240), texto: titulo, fim, link, orgao: orgao.id, oficial: false, fonte: fonte || 'Notícia', publicadoEm: pubISO });
  }
  return itens;
}

const palavras = s => new Set(String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter(w => w.length > 3 && !/^(para|com|das|dos|est[aá]gio|estagiarios?|inscricoes|abertas?|selecao|processo|seletivo|curso|direito)$/.test(w)));
const parecido = (a, b) => { const A = palavras(a), B = palavras(b); if (!A.size || !B.size) return false; let n = 0; A.forEach(w => B.has(w) && n++); return n / Math.min(A.size, B.size) >= 0.6; };
const hash = s => { let h = 5381; for (const ch of String(s)) h = (h * 33 + ch.charCodeAt(0)) >>> 0; return h.toString(36); };

export async function buscarEstagios(orgaos, { fetchFn = fetch, noticias = true, apenasDireito = true, hoje, timeoutMs = 25000 } = {}) {
  const itens = [], erros = [];
  const baixar = async url => {
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), timeoutMs);
    try {
      const r = await fetchFn(url, { signal: ctl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AgoraJuridica-Radar/1.0)', Accept: 'text/html,application/xml;q=0.9,*/*;q=0.8' } });
      if (!r.ok) throw new Error('respondeu ' + r.status);
      const buf = new Uint8Array(await r.arrayBuffer()); let s = new TextDecoder('utf-8').decode(buf);
      if (/charset=["']?(iso-8859-1|windows-1252)/i.test(s.slice(0, 3000)) || (s.match(/�/g) || []).length > 20) s = new TextDecoder('windows-1252').decode(buf);
      return s;
    } catch (e) { throw new Error(e.name === 'AbortError' ? 'tempo esgotado' : e.message); } finally { clearTimeout(t); }
  };
  for (const o of orgaos.filter(o => o.ativo !== false)) {
    if (o.url) { try { itens.push(...extrairEstagiosPagina(await baixar(o.url), o, { hoje, apenasDireito })); } catch (e) { erros.push(`${o.sigla} (página): ${e.message}`); } }
    if (noticias && (o.busca || o.sigla)) { try { itens.push(...extrairEstagiosNoticias(await baixar(urlNoticias(o)), o, { hoje, apenasDireito })); } catch (e) { erros.push(`${o.sigla} (notícias): ${e.message}`); } }
  }
  // a mesma seleção vinda da página oficial e de notícias aparece uma vez só (a oficial vence)
  const finais = [];
  for (const x of itens.sort((a, b) => b.oficial - a.oficial)) {
    const dup = finais.find(y => y.orgao === x.orgao && (y.link === x.link || parecido(y.titulo, x.titulo)));
    if (dup) { if (!dup.fim && x.fim) dup.fim = x.fim; continue; }
    finais.push(x);
  }
  return { itens: finais, erros };
}

const dataBR = iso => iso ? iso.split('-').reverse().join('/') : '';
const resumir = (s, n) => s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s;
export function estagioParaPublicacao(x, o, agora = Date.now()) {
  const origem = 'radarest:' + (x.oficial ? x.link + '#' + hash(x.titulo) : x.link);
  const tit = x.titulo.toLowerCase().includes(o.sigla.toLowerCase().split('/')[0]) ? x.titulo : `${o.sigla}: ${x.titulo}`;
  return {
    id: 're_' + hash(origem), categoria: 'estagio', titulo: resumir(tit, 150), instituicao: `${o.nome} (${o.sigla})`, local: o.uf || '', resumo: resumir(x.texto.startsWith(x.titulo) && x.texto.length - x.titulo.length > 20 ? x.texto.slice(x.titulo.length).replace(/^\s*·\s*/, '') : x.fim ? `Inscrições até ${dataBR(x.fim)}. Fonte: ${x.fonte}.` : `Fonte: ${x.fonte}. Confira o prazo de inscrição no edital.`, 280),
    conteudo: `${x.texto}\n\n${x.fim ? `Inscrições até ${dataBR(x.fim)}.` : 'O prazo de inscrição não foi identificado automaticamente: confira no edital.'}\n\nInformação reunida automaticamente pelo Radar de estágios do portal, a partir ${x.oficial ? `da página oficial do órgão` : `de notícia publicada por ${x.fonte}`}. Antes de se inscrever, confira sempre o edital oficial: requisitos, vagas, bolsa e datas podem mudar.`,
    prazo: x.fim || '', link: x.link, auto: x.oficial, radarEst: true, oficial: x.oficial, fonte: x.fonte, orgaoId: o.id, origem, criadoEm: agora, atualizadoEm: agora
  };
}

/* Junta o que foi encontrado aos dados do portal.
   - Seleção nova entra; mudança de prazo é atualizada.
   - Sem prazo identificado, fica 30 dias a partir da primeira vez que foi vista e não volta depois.
   - Com prazo, sai 1 dia depois do fim das inscrições. */
export function mesclarEstagios(dados, itens, { agora = Date.now(), via = '', erros = [], orgaos = ORGAOS_PADRAO, verificouNoticias = false } = {}) {
  dados.publicacoes = dados.publicacoes || []; dados.config = dados.config || {};
  const cfg = { ...PADRAO_ESTAGIOS, ...(dados.config.radarEstagios || {}) };
  const hoje = new Date(agora - 3 * 3600000).toISOString().slice(0, 10);
  const ontem = new Date(agora - 27 * 3600000).toISOString().slice(0, 10);
  const vistos = { ...(cfg.vistos || {}) }, ign = new Set(cfg.ignorados || []);
  const porOrigem = new Map(dados.publicacoes.filter(p => p.radarEst).map(p => [p.origem, p]));
  const porId = new Map(orgaos.map(o => [o.id, o]));
  let novas = 0, atualizadas = 0;
  for (const x of itens) {
    const o = porId.get(x.orgao); if (!o) continue;
    const pub = estagioParaPublicacao(x, o, agora - novas);
    if (ign.has(pub.origem)) continue;
    const visto = vistos[pub.origem] || (vistos[pub.origem] = agora);
    if (!pub.prazo && agora - visto > 30 * 86400000) continue; // já cumpriu os 30 dias
    pub.expiraEm = pub.prazo || new Date(visto + 30 * 86400000).toISOString().slice(0, 10);
    const atual = porOrigem.get(pub.origem);
    if (!atual) { dados.publicacoes.push(pub); porOrigem.set(pub.origem, pub); novas++; }
    else if (atual.prazo !== pub.prazo || atual.resumo !== pub.resumo || atual.titulo !== pub.titulo) { Object.assign(atual, { ...pub, id: atual.id, criadoEm: atual.criadoEm }); atualizadas++; }
  }
  const antes = dados.publicacoes.length;
  dados.publicacoes = dados.publicacoes.filter(p => !p.radarEst || ((p.expiraEm || p.prazo || '9999') >= ontem));
  const removidas = antes - dados.publicacoes.length;
  const rad = dados.publicacoes.filter(p => p.radarEst);
  if (rad.length > 300) { const fora = new Set(rad.sort((a, b) => b.criadoEm - a.criadoEm).slice(300).map(p => p.id)); dados.publicacoes = dados.publicacoes.filter(p => !fora.has(p.id)); }
  // memória das seleções já vistas: guarda as dos últimos 120 dias
  const lim = agora - 120 * 86400000;
  cfg.vistos = Object.fromEntries(Object.entries(vistos).filter(([, t]) => t > lim).slice(-3000));
  cfg.ultima = { em: agora, via, orgaos: orgaos.filter(o => o.ativo !== false).length, encontrados: itens.length, novas, atualizadas, removidas, abertos: dados.publicacoes.filter(p => p.radarEst && (!p.prazo || p.prazo >= hoje)).length, erros: erros.slice(0, 12) };
  if (verificouNoticias) cfg.ultimaNoticias = agora;
  dados.config.radarEstagios = cfg;
  return { novas, atualizadas, removidas, cfg };
}

/* Assinatura do que o aluno vê, para saber se vale gravar */
export const assinaturaEstagios = d => JSON.stringify([(d.publicacoes || []).filter(p => p.radarEst).map(p => [p.id, p.prazo, p.titulo, p.resumo, p.expiraEm]).sort(), Object.keys(d.config?.radarEstagios?.vistos || {}).length]);
