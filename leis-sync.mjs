/* Ágora Jurídica — sincronização automática das atualizações da lei
   Fonte oficial: Dados Abertos do Senado Federal (base de normas jurídicas federais).
   Este arquivo é usado em dois lugares:
   - pelo GitHub Actions (scripts/sincronizar-leis.mjs), a cada hora;
   - pelo botão "Sincronizar agora" do painel administrativo. */

export const BASE_SENADO = 'https://legis.senado.leg.br/dadosabertos';

export const TIPOS_NORMA = {
  LEI: { nome: 'Lei Ordinária', curto: 'Lei' },
  LCP: { nome: 'Lei Complementar', curto: 'Lei Complementar' },
  EMC: { nome: 'Emenda Constitucional', curto: 'Emenda Constitucional' },
  MPV: { nome: 'Medida Provisória', curto: 'Medida Provisória' },
  DEC: { nome: 'Decreto', curto: 'Decreto' }
};

export const PADRAO_LEIS = { ativo: true, tipos: ['LEI', 'LCP', 'EMC', 'MPV'], ignorarComemorativas: true, diasIniciais: 30, desde: '', ignorados: [], ultima: null };

/* Leis que só dão nome a rodovias, criam datas comemorativas ou abrem crédito no orçamento */
const COMEMORATIVA = /^\s*(denomina|d[áa] (a )?denomina|inscreve o nome|institui o dia|institui a semana|institui o m[eê]s|institui o ano|declara patrono|declara patrona|declara o munic[íi]pio|confere o t[íi]tulo|confere ao munic[íi]pio|declara (de )?patrim[ôo]nio|reconhece o munic[íi]pio|reconhece a cidade|abre (ao or[çc]amento|cr[ée]dito)|autoriza a abertura de cr[ée]dito|altera a denomina)/i;

const PISTAS = [
  ['Direito Penal', /c[óo]digo penal|crime|penal\b|pena |pris[ãa]o|tr[áa]fico|viol[êe]ncia|homic[íi]dio|lei maria da penha|execu[çc][ãa]o penal/i],
  ['Processo Penal', /processo penal|inqu[ée]rito|a[çc][ãa]o penal|j[úu]ri/i],
  ['Processo Civil', /processo civil|c[óo]digo de processo civil|lei n[ºo] 13\.105/i],
  ['Direito Civil', /c[óo]digo civil|fam[íi]lia|sucess|contrat|propriedade|condom[íi]nio|lei n[ºo] 10\.406/i],
  ['Direito do Trabalho', /trabalh|clt|consolida[çc][ãa]o das leis do trabalho|empregad|sindica/i],
  ['Direito Tributário', /tribut|imposto|contribui[çc][ãa]o social|ibs\b|cbs\b|icms|ipi\b|imposto de renda/i],
  ['Direito do Consumidor', /consumidor|defesa do consumidor/i],
  ['Direito Ambiental', /ambient|florest|recursos h[íi]dricos|fauna|flora|clima/i],
  ['Direito Administrativo', /licita[çc]|servidor(es)? p[úu]blic|administra[çc][ãa]o p[úu]blica|improbidade|ag[êe]ncia reguladora/i],
  ['Direito Empresarial', /empres|fal[êe]ncia|recupera[çc][ãa]o judicial|sociedade an[ôo]nima|mercado de capitais/i],
  ['Direito Constitucional', /constitui[çc][ãa]o federal|emenda constitucional|art\. \d+ da constitui/i],
  ['Ética e Estatuto da OAB', /advocacia|ordem dos advogados|estatuto da oab/i],
  ['Direitos Humanos', /direitos humanos|crian[çc]a e do adolescente|pessoa com defici[êe]ncia|pessoa idosa|igualdade racial/i]
];
export function disciplinaDaEmenta(ementa, tipo) {
  for (const [d, re] of PISTAS) if (re.test(ementa || '')) return d;
  return tipo === 'EMC' ? 'Direito Constitucional' : '';
}

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export function normalizarData(v) {
  const s = String(v || '').trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/); if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  m = s.match(/^(\d{4})(\d{2})(\d{2})$/); if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return '';
}
const dataExtenso = iso => { const [a, m, d] = iso.split('-').map(Number); return `${d === 1 ? '1º' : d} de ${MESES[m - 1]} de ${a}`; };
const numeroFmt = (n, tipo) => {
  const s = String(n || '').trim().replace(/^0+(?=\d)/, '');
  const m = s.match(/^(\d+)(.*)$/); if (!m || tipo === 'EMC') return s;
  return m[1].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + m[2];
};

/* Acha os registros de normas em qualquer formato de resposta (o envelope do Senado varia) */
function chave(o, ...nomes) {
  const ks = Object.keys(o); for (const n of nomes) { const k = ks.find(k => k.toLowerCase() === n.toLowerCase()); if (k != null && o[k] != null && o[k] !== '') return o[k]; }
  return undefined;
}
const texto = v => (v && typeof v === 'object') ? (v['#text'] ?? v.texto ?? v.Texto ?? Object.values(v).find(x => typeof x === 'string') ?? '') : (v ?? '');
export function extrairNormas(json, tipoPadrao) {
  const out = [];
  const visto = new Set();
  (function walk(x) {
    if (Array.isArray(x)) { x.forEach(walk); return; }
    if (!x || typeof x !== 'object') return;
    const id = chave(x, 'id', 'codigo', 'idNorma', 'codigoNorma', 'CodigoNorma');
    const numero = chave(x, 'numero', 'NumeroNorma', 'numeroNorma');
    if (id != null && numero != null && typeof id !== 'object') {
      const tipo = String(texto(chave(x, 'tipo', 'siglaTipo', 'SiglaTipoNorma', 'tipoNorma')) || tipoPadrao || '').toUpperCase().split(/[^A-Z]/)[0] || tipoPadrao;
      const r = {
        id: String(id), tipo, numero: String(texto(numero)),
        data: normalizarData(texto(chave(x, 'dataassinatura', 'dataAssinatura', 'data', 'dataNorma', 'DataAssinatura', 'datapublicacao', 'dataPublicacao'))),
        ementa: String(texto(chave(x, 'ementa', 'Ementa', 'descricao')) || '').replace(/\s+/g, ' ').trim(),
        nome: String(texto(chave(x, 'normaNome', 'nome', 'apelido', 'NomeNorma')) || '').trim()
      };
      if (!visto.has(r.id)) { visto.add(r.id); out.push(r); }
      return;
    }
    Object.values(x).forEach(walk);
  })(json);
  return out;
}

/* Consulta o Senado. anos: lista de anos; tipos: siglas (LEI, LCP, EMC, MPV, DEC) */
export async function buscarNormas({ tipos = PADRAO_LEIS.tipos, anos, fetchFn = fetch, base = BASE_SENADO, timeoutMs = 25000 } = {}) {
  const hoje = new Date();
  anos = anos || (hoje.getMonth() === 0 ? [hoje.getFullYear() - 1, hoje.getFullYear()] : [hoje.getFullYear()]);
  const normas = [], erros = [];
  for (const tipo of tipos) for (const ano of anos) {
    const url = `${base}/legislacao/lista.json?tipo=${encodeURIComponent(tipo)}&ano=${ano}`;
    try {
      const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const t = ctl && setTimeout(() => ctl.abort(), timeoutMs);
      const r = await fetchFn(url, { headers: { Accept: 'application/json' }, ...(ctl ? { signal: ctl.signal } : {}) });
      if (t) clearTimeout(t);
      if (r.status === 404) continue; // nenhuma norma desse tipo no ano
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      for (const n of extrairNormas(j, tipo)) { if (!n.tipo || !TIPOS_NORMA[n.tipo]) n.tipo = tipo; normas.push(n); }
    } catch (e) {
      erros.push(`${tipo}/${ano}: ${e.name === 'AbortError' ? 'tempo esgotado' : e.message}`);
      if (e instanceof TypeError && /fetch|network|cors|load/i.test(e.message)) { const err = new Error('O navegador não conseguiu acessar o portal do Senado (bloqueio de acesso direto).'); err.cors = true; throw err; }
    }
  }
  return { normas, erros, anos };
}

/* Transforma uma norma em publicação da seção "Atualizações da lei" */
export function normaParaPublicacao(n, agora = Date.now()) {
  const T = TIPOS_NORMA[n.tipo] || { nome: n.tipo, curto: n.tipo };
  const disc = disciplinaDaEmenta(n.ementa, n.tipo);
  const titulo = `${T.curto} nº ${numeroFmt(n.numero, n.tipo)}${n.data ? `, de ${dataExtenso(n.data)}` : ''}`;
  const link = `https://legis.senado.leg.br/norma/${encodeURIComponent(n.id)}`;
  return {
    id: `lei-${n.tipo.toLowerCase()}-${n.id}`, origem: `senado:${n.id}`, auto: true, tipoNorma: n.tipo,
    categoria: 'lei', titulo, instituicao: T.nome, local: disc ? `Federal · ${disc}` : 'Federal', disciplina: disc,
    prazo: n.data, link, resumo: n.ementa || (n.nome ? n.nome : ''),
    conteudo: `${n.nome && n.nome !== titulo ? n.nome + '\n\n' : ''}Norma federal publicada oficialmente${n.data ? ' em ' + dataExtenso(n.data) : ''}.\n\nEmenta: ${n.ementa || 'consulte o texto oficial.'}\n\nFonte: Senado Federal, Dados Abertos (base de normas jurídicas federais). Esta publicação foi sincronizada automaticamente; consulte sempre o texto oficial pelo botão abaixo.`,
    criadoEm: agora, atualizadoEm: agora
  };
}

/* Junta as normas novas aos dados do portal (objeto com publicacoes e config). Retorna o resumo. */
export function mesclar(dados, normas, { agora = Date.now(), via = '', erros = [] } = {}) {
  dados.publicacoes = dados.publicacoes || [];
  dados.config = dados.config || {};
  const cfg = { ...PADRAO_LEIS, ...(dados.config.leisAuto || {}) };
  if (!cfg.desde) cfg.desde = new Date(agora - (cfg.diasIniciais || 30) * 86400000).toISOString().slice(0, 10);
  const ign = new Set(cfg.ignorados || []);
  const existentes = new Set(dados.publicacoes.map(p => p.origem).filter(Boolean));
  const novas = [];
  let ignComem = 0, semData = 0;
  for (const n of normas) {
    const origem = `senado:${n.id}`;
    if (!cfg.tipos.includes(n.tipo) || existentes.has(origem) || ign.has(origem)) continue;
    if (!n.data) { semData++; continue; }
    if (n.data < cfg.desde) continue;
    if (cfg.ignorarComemorativas && COMEMORATIVA.test(n.ementa)) { ignComem++; continue; }
    const p = normaParaPublicacao(n, agora - novas.length); // mantém a ordem estável
    existentes.add(origem); novas.push(p);
  }
  novas.sort((a, b) => String(a.prazo).localeCompare(String(b.prazo)));
  dados.publicacoes.push(...novas);
  cfg.ultima = { em: agora, novas: novas.length, verificadas: normas.length, comemorativas: ignComem, semData, erros: erros.slice(0, 6), via };
  dados.config.leisAuto = cfg;
  return { novas, cfg };
}
