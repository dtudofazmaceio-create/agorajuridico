/* Ágora Jurídica — Radar de concursos
   Lê as listas públicas de concursos com inscrições abertas (PCI Concursos, por região),
   separa os da área jurídica e publica cada um em "Estágios, concursos e empregos",
   na aba Concursos, com o prazo de inscrição e o link da fonte.
   Usado pelo GitHub Actions (scripts/radar-concursos.mjs). Cada concurso sai sozinho
   do portal quando o prazo de inscrição termina. */

export const FONTES_RADAR = [
  'https://www.pciconcursos.com.br/concursos/nacional/',
  'https://www.pciconcursos.com.br/concursos/sudeste/',
  'https://www.pciconcursos.com.br/concursos/sul/',
  'https://www.pciconcursos.com.br/concursos/nordeste/',
  'https://www.pciconcursos.com.br/concursos/norte/',
  'https://www.pciconcursos.com.br/concursos/centrooeste/'
];
export const PADRAO_RADAR = { ativo: true, apenasDireito: true, ufs: [], extras: '', ignorados: [], ultima: null };

/* Cargos e órgãos da área jurídica */
export const AREA_JURIDICA = new RegExp([
  'juiz', 'ju[íi]za', 'magistratura', 'promotor', 'minist[ée]rio p[úu]blico', '\\bmp[a-z]{0,2}\\b', 'defensor', 'defensoria', 'procurador', 'procuradoria',
  'advogad', 'advocacia', '\\bagu\\b', '\\bpg[efmn]\\b', '\\bpgfn\\b', 'delegad', 'escriv[ãa]o de pol[íi]cia', 'oficial de justi[çc]a', 'analista judici',
  't[ée]cnico judici', 'escrevente', 'cart[óo]rio', 'serventias', 'not[áa]ri', 'registrador', 'tribunal', '\\btj[a-z]{0,2}\\b', '\\btr[fte]\\b', '\\btr[fte] ?\\d',
  '\\bstj\\b', '\\bstf\\b', '\\btst\\b', '\\btse\\b', '\\bstm\\b', '\\bcnj\\b', '\\bdpu\\b', '\\bdpe\\b', '\\bmpf\\b', '\\bmpt\\b', '\\bmpu\\b', 'conciliador', 'mediador',
  'assessor jur[íi]dico', 'analista jur[íi]dico', 'consultor jur[íi]dico', 'bacharel em direito', 'ci[êe]ncias jur[íi]dicas', 'em direito', 'jur[íi]dic'
].join('|'), 'i');

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ordm: 'º', ordf: 'ª', ccedil: 'ç', Ccedil: 'Ç', atilde: 'ã', otilde: 'õ', aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', acirc: 'â', ecirc: 'ê', ocirc: 'ô', agrave: 'à', Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', Atilde: 'Ã', Otilde: 'Õ' };
export const textoLimpo = h => String(h || '')
  .replace(/<br\s*\/?>/gi, ' · ').replace(/<\/(p|div|li|span)>/gi, ' · ').replace(/<[^>]+>/g, ' ')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16))).replace(/&([a-z]+);/gi, (m, n) => ENT[n] ?? m)
  .replace(/\s+/g, ' ').replace(/(\s*·\s*)+/g, ' · ').replace(/^\s*·\s*|\s*·\s*$/g, '').trim();
const isoDe = br => { const m = String(br).match(/(\d{2})\/(\d{2})\/(\d{4})/); return m ? `${m[3]}-${m[2]}-${m[1]}` : ''; };
const absoluta = (href, base) => { try { return new URL(href, base).href; } catch { return ''; } };

/* Extrai os concursos de uma página de lista. Formato do PCI: cada concurso fica num bloco
   <div class="ca"> com o órgão (link), a UF (div.cc), a descrição (div.cd: vagas, cargos,
   escolaridade e salário) e o fim das inscrições (div.ce). */
export function extrairConcursos(html, fonte = '') {
  const itens = [];
  const blocos = String(html || '').split(/<div[^>]*class=["'][^"']*\bca\b[^"']*["'][^>]*>/i).slice(1);
  for (const b0 of blocos) {
    const b = b0.split(/<div[^>]*class=["'][^"']*\bca\b[^"']*["']/i)[0].slice(0, 6000);
    const a = b.match(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i); if (!a) continue;
    const orgao = textoLimpo(a[2]); if (!orgao) continue;
    const uf = textoLimpo((b.match(/class=["'][^"']*\bcc\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) || [])[1] || '').slice(0, 30);
    const desc = textoLimpo((b.match(/class=["'][^"']*\bcd\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) || [])[1] || '');
    const ce = (b.match(/class=["'][^"']*\bce\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) || [])[1] || b;
    const datas = [...ce.matchAll(/\d{2}\/\d{2}\/\d{4}/g)].map(m => isoDe(m[0])).filter(Boolean).sort();
    const link = absoluta((b.match(/data-url=["']([^"']+)["']/i) || [])[1] || a[1], fonte || 'https://www.pciconcursos.com.br/');
    itens.push({ orgao, uf, desc, fim: datas[datas.length - 1] || '', link, fonte });
  }
  return itens;
}
export function relevante(c, cfg = PADRAO_RADAR) {
  const txt = `${c.orgao} ${c.desc}`;
  const extras = String(cfg.extras || '').split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
  const porArea = !cfg.apenasDireito || AREA_JURIDICA.test(txt) || extras.some(x => txt.toLowerCase().includes(x.toLowerCase()));
  const ufs = (cfg.ufs || []).map(u => u.toUpperCase());
  const porUF = !ufs.length || ufs.includes(String(c.uf).toUpperCase().slice(0, 2)) || /nacional|br\b/i.test(c.uf);
  return porArea && porUF;
}
export async function buscarConcursos({ fontes = FONTES_RADAR, fetchFn = fetch, timeoutMs = 30000 } = {}) {
  const todos = [], erros = [];
  for (const url of fontes) {
    try {
      const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), timeoutMs);
      const r = await fetchFn(url, { signal: ctl.signal, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AgoraJuridica-Radar/1.0)', Accept: 'text/html' } });
      clearTimeout(t);
      if (!r.ok) { erros.push(`${url} respondeu ${r.status}`); continue; }
      const buf = new Uint8Array(await r.arrayBuffer());
      let html = new TextDecoder('utf-8').decode(buf);
      if (/charset=["']?iso-8859-1|charset=["']?windows-1252/i.test(html.slice(0, 3000)) || (html.match(/�/g) || []).length > 20) html = new TextDecoder('windows-1252').decode(buf);
      const itens = extrairConcursos(html, url);
      if (!itens.length) erros.push(`Nenhum concurso reconhecido em ${url} (a página pode ter mudado de formato)`);
      todos.push(...itens);
    } catch (e) { erros.push(`${url}: ${e.name === 'AbortError' ? 'tempo esgotado' : e.message}`); }
  }
  const vistos = new Set(), unicos = todos.filter(c => { const k = c.link || c.orgao + c.fim; if (vistos.has(k)) return false; vistos.add(k); return true; });
  return { concursos: unicos, erros };
}
const dataBR = iso => iso ? iso.split('-').reverse().join('/') : '';
const hash = s => { let h = 5381; for (const ch of String(s)) h = (h * 33 + ch.charCodeAt(0)) >>> 0; return h.toString(36); };
export function concursoParaPublicacao(c, agora = Date.now()) {
  const resumo = c.desc.length > 300 ? c.desc.slice(0, 297).replace(/\s+\S*$/, '') + '…' : c.desc;
  return {
    id: 'rc_' + hash(c.link || c.orgao), categoria: 'concurso', titulo: `${c.orgao}: inscrições abertas`, instituicao: c.orgao, local: c.uf, resumo,
    conteudo: `${c.desc}\n\nInscrições até ${dataBR(c.fim)}.\n\nInformação reunida automaticamente pelo Radar de concursos do portal, a partir da lista pública do PCI Concursos. Antes de se inscrever, confira sempre o edital oficial: requisitos, vagas, taxas e datas podem mudar.`,
    prazo: c.fim, link: c.link, auto: true, radar: true, fonte: 'PCI Concursos', origem: 'radar:' + (c.link || c.orgao), criadoEm: agora, atualizadoEm: agora
  };
}
/* Junta o que veio da fonte aos dados do portal: novos entram, mudanças de prazo são atualizadas
   e os concursos com inscrições encerradas há mais de 3 dias saem. */
export function mesclarConcursos(dados, concursos, { agora = Date.now(), via = '', erros = [] } = {}) {
  dados.publicacoes = dados.publicacoes || []; dados.config = dados.config || {};
  const cfg = { ...PADRAO_RADAR, ...(dados.config.radarConcursos || {}) };
  const hoje = new Date(agora - 3 * 3600000).toISOString().slice(0, 10), corte = new Date(agora - 3 * 86400000).toISOString().slice(0, 10);
  const ign = new Set(cfg.ignorados || []);
  const porOrigem = new Map(dados.publicacoes.filter(p => p.radar).map(p => [p.origem, p]));
  let novas = 0, atualizadas = 0, relevantes = 0;
  for (const c of concursos) {
    if (!c.fim || c.fim < hoje || !relevante(c, cfg)) continue;
    relevantes++;
    const pub = concursoParaPublicacao(c, agora - novas), atual = porOrigem.get(pub.origem);
    if (ign.has(pub.origem)) continue;
    if (!atual) { dados.publicacoes.push(pub); porOrigem.set(pub.origem, pub); novas++; }
    else if (atual.prazo !== pub.prazo || atual.resumo !== pub.resumo) { Object.assign(atual, { ...pub, id: atual.id, criadoEm: atual.criadoEm }); atualizadas++; }
  }
  const antes = dados.publicacoes.length;
  dados.publicacoes = dados.publicacoes.filter(p => !p.radar || (p.prazo && p.prazo >= corte));
  const removidas = antes - dados.publicacoes.length;
  // limite de segurança: no máximo 400 concursos do radar
  const radar = dados.publicacoes.filter(p => p.radar).sort((a, b) => String(a.prazo).localeCompare(String(b.prazo)));
  if (radar.length > 400) { const fora = new Set(radar.slice(400).map(p => p.id)); dados.publicacoes = dados.publicacoes.filter(p => !fora.has(p.id)); }
  cfg.ultima = { em: agora, via, encontrados: concursos.length, relevantes, novas, atualizadas, removidas, abertos: dados.publicacoes.filter(p => p.radar && p.prazo >= hoje).length, erros: erros.slice(0, 8) };
  dados.config.radarConcursos = cfg;
  return { novas, atualizadas, removidas, cfg };
}
