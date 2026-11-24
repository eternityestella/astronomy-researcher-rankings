'use strict';

const { headers, rows, methods } = window.ASTRONOMY;
const { records: directionData, broad, specific } = window.ASTRONOMY_TOPICS;
const unknownDirection = '方向证据不足';
const byId = id => document.getElementById(id);
const number = new Intl.NumberFormat('en-US');
const decimal = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const collator = new Intl.Collator('zh-CN', { sensitivity: 'base', numeric: true });
const englishRegions = new Intl.DisplayNames(['en'], { type: 'region', fallback: 'none' });
const chineseRegions = new Intl.DisplayNames(['zh-CN'], { type: 'region', fallback: 'none' });
const normalize = value => String(value ?? '').normalize('NFKD').toLowerCase().replace(/\p{Mark}/gu, '');
const plain = value => typeof value === 'number' ? number.format(value) : value || '—';
const formatScore = value => decimal.format(value);

const regionKeys = new Map();
for (let a = 65; a <= 90; a++) {
  for (let b = 65; b <= 90; b++) {
    const code = String.fromCharCode(a, b);
    const english = englishRegions.of(code);
    if (english) regionKeys.set(normalize(english), code);
  }
}
for (const [name, code] of [
  ['china, nanjing', 'CN'], ['china, taipei', 'TW'],
  ['netherlands, the', 'NL'], ['korea, republic of', 'KR'], ['iran, islamic republic of', 'IR'],
  ['czech republic', 'CZ'], ['russian federation', 'RU'], ['viet nam', 'VN'], ['turkey', 'TR'],
  ['serbia, republic of', 'RS'], ['korea, rep of', 'KR'], ['iran, islamic rep of', 'IR'],
  ['croatia, the republic of', 'HR'], ['slovenia, the republic of', 'SI'],
  ['vatican city state', 'VA'], ['azerbaijan, republic of', 'AZ'], ['botswana, republic of', 'BW'],
  ['ivory coast, republic of', 'CI'], ["korea, democratic people's republic of", 'KP'], ['syrian arab republic', 'SY'],
]) regionKeys.set(name, code);

function regionNames(value) {
  if (!value) return ['地区未列'];
  const pieces = String(value).split(' | ').map(item => {
    const code = /^[A-Z]{2}$/.test(item) ? item : regionKeys.get(normalize(item));
    return code ? chineseRegions.of(code) || item : item;
  });
  return [...new Set(pieces)];
}

const regionCounts = new Map();
const topicCounts = new Map();
const records = rows.map((row, index) => {
  const regions = regionNames(row[11]);
  const classification = directionData[row[13]];
  const tags = classification?.[1].map(item => item[0]) ?? [unknownDirection];
  for (const tag of tags) topicCounts.set(tag, (topicCounts.get(tag) || 0) + 1);
  for (const region of regions) regionCounts.set(region, (regionCounts.get(region) || 0) + 1);
  return {
    row, regions, index, tags, classification,
    query: normalize([row[1], row[2], row[9], row[11], ...regions, ...tags].filter(Boolean).join(' ')),
  };
});
const scored = rows.filter(row => row[3] > 0).length;
byId('total-count').textContent = number.format(rows.length);
byId('scored-count').textContent = number.format(scored);
byId('unscored-count').textContent = number.format(rows.length - scored);
const snapshot = String(methods[1]?.[0] || '').match(/\d{4}-\d{2}-\d{2}/)?.[0];
byId('snapshot').textContent = snapshot ? '数据快照 · ' + snapshot : '综合排名';
const regionOptions = [...regionCounts].sort(([a, ac], [b, bc]) => {
  if (a === '地区未列') return 1;
  if (b === '地区未列') return -1;
  return bc - ac || collator.compare(a, b);
});
for (const [name, count] of regionOptions) {
  byId('region').add(new Option(name + ' · ' + number.format(count), name));
}
for (const [label, names] of [['学科大类', broad], ['专题方向', specific]]) {
  const group = document.createElement('optgroup');
  group.label = label;
  for (const name of names) {
    if (topicCounts.has(name)) group.append(new Option(name + ' · ' + number.format(topicCounts.get(name)), name));
  }
  byId('topic').append(group);
}
if (topicCounts.has(unknownDirection)) {
  byId('topic').add(new Option(unknownDirection + ' · ' + number.format(topicCounts.get(unknownDirection)), unknownDirection));
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function sourceLinks(raw, name) {
  const result = [];
  if (!raw) return result;
  for (const item of String(raw).split(' | ')) {
    try {
      const url = new URL(item.trim());
      if (url.protocol !== 'https:' && url.protocol !== 'http:') continue;
      const link = element('a', name + (result.length ? ' ' + (result.length + 1) : ''));
      link.href = url.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      result.push(link);
    } catch {
      // Non-URL data and unavailable sources have no navigable link.
    }
  }
  return result;
}

function detailsList(pairs) {
  const list = element('dl', undefined, 'details');
  for (const [label, value] of pairs) {
    const pair = element('div');
    pair.append(element('dt', label), element('dd', plain(value)));
    list.append(pair);
  }
  return list;
}

function detailSection(label, nodes) {
  const section = element('section', undefined, 'detail-section');
  section.append(element('h3', label), ...nodes);
  return section;
}

const detail = byId('detail');
function showDetail(record) {
  const { row, regions, classification } = record;
  byId('detail-title').textContent = row[2] ? row[2] + ' · ' + row[1] : row[1];
  const summary = element('p', undefined, 'detail-summary');
  summary.append(element('strong', formatScore(row[3]) + ' / 100', 'detail-score'));
  summary.append(element('span', '综合第 ' + number.format(row[0]) + ' 名', 'detail-meta'));
  const profile = detailSection('身份与证据', [
    detailsList([
      ['机构', row[9]], ['机构来源', row[10]], ['地区或 IAU 归属', regions.join('、')],
      ['岗位或纳入状态', row[14]], ['证据状态', row[8]], ['原名录行号', row[13]],
    ]),
    ...sourceLinks(row[30], '查阅机构或身份来源'),
  ]);
  const directionNodes = [];
  if (classification) {
    directionNodes.push(element('p', '论文归类窗口 ' + classification[0] + '–2025。作品可计入多个方向。', 'detail-meta'));
    const list = element('ul', undefined, 'direction-evidence');
    for (const [tag, count, year, arxiv, title] of classification[1]) {
      const line = element('li');
      line.append(element('strong', tag), element('span', number.format(count) + ' 篇', 'method-points'));
      if (arxiv && title) line.append(...sourceLinks('https://arxiv.org/abs/' + arxiv, year + ' · ' + title));
      list.append(line);
    }
    directionNodes.push(list);
  } else {
    directionNodes.push(element('p', '现有匹配作品不足以判定研究方向。'));
  }
  const direction = detailSection('研究方向及论文依据', directionNodes);
  const scoring = detailSection('分项评分', [
    detailsList([
      ['长期成果与影响 / 35', formatScore(row[4])],
      ['近期影响 / 35', formatScore(row[5])],
      ['近期产出 / 15', formatScore(row[6])],
      ['奖项及发现 / 15', formatScore(row[7])],
      ['只按文献指标的名次', row[12]],
    ]),
  ]);
  const evidence = detailSection('作品与引文证据', [
    detailsList([...Array.from({ length: 11 }, (_, i) => [headers[15 + i], row[15 + i]]),
      [headers[27], row[27]],
    ]),
    ...sourceLinks(row[26], '查阅代表作品'),
  ]);
  const body = byId('detail-body');
  body.replaceChildren(summary, profile, direction, scoring, evidence);
  if (row[28]) {
    body.append(detailSection('奖项与发现依据', [
      ...String(row[28]).split(' | ').map(item => element('p', item)),
      ...sourceLinks(row[29], '查阅公开来源'),
    ]));
  }
  detail.showModal();
  detail.scrollTop = 0;
}

const methodDialog = byId('method');
function methodItems(items, type) {
  const list = element('ul', undefined, 'method-list');
  for (const [label, score, description, source] of items) {
    if (!label) continue;
    const li = element('li');
    li.append(element('strong', label));
    if (typeof score === 'number') li.append(element('span', number.format(score) + (type === 'criteria' ? ' 分' : ''), 'method-points'));
    if (description !== null && description !== undefined) li.append(element('p', plain(description)));
    const links = sourceLinks(source, '公开来源');
    if (links.length) li.append(...links);
    else if (source) li.append(element('p', source));
    list.append(li);
  }
  return list;
}

function buildMethods() {
  const body = byId('method-body');
  body.append(element('p', methods[1]?.[0], 'method-note'));
  body.append(methodItems(methods.slice(4, 8), 'criteria'));
  const classification = element('details', undefined, 'method-more');
  classification.append(element('summary', '研究方向与地区的分类口径'), methodItems([
    ['研究方向', null, '按匹配到的 astro-ph 论文归类。2016–2025 年有至少 3 篇可分大类的论文时，使用这 10 年的记录。其余使用 1992–2025 年记录。'],
    ['学科大类', null, '按每篇论文的首个 astro-ph 子分类统计。一个大类需至少 2 篇，并占该作者可分大类作品的至少 20%。'],
    ['专题方向', null, '以论文标题中的主题关键词识别。一个专题需至少 2 篇匹配论文。标签可以重叠，表示现有作品支持该方向。'],
    ['国家或地区', null, '沿用名录的机构、引文库地区或 IAU 归属字段，统一常见名称写法。地区筛选基于该字段，可命中一个人的多个地区。'],
    ['计数', null, '分类后的数字显示全表匹配条数。多个标签之间的计数可能重叠。'],
  ]));
  body.append(classification);
  for (const [title, section] of [
    ['公式与作者匹配', methods.slice(10, 17)],
    ['覆盖统计和来源', methods.slice(19, 29)],
    ['Crossref 期刊及样本数', methods.slice(31)],
  ]) {
    const group = element('details', undefined, 'method-more');
    group.append(element('summary', title), methodItems(section));
    body.append(group);
  }
}

buildMethods();
byId('method-button').addEventListener('click', () => {
  methodDialog.showModal();
  methodDialog.scrollTop = 0;
});

const sortButtons = [...document.querySelectorAll('[data-sort]')];
const state = { sort: 0, descending: false, page: 1, size: 25, maxPage: 1, browse: 'topic', expanded: false };
let matching = records;

function sortRecords() {
  const { sort, descending } = state;
  const sign = descending ? -1 : 1;
  matching.sort((a, b) => {
    const valueA = a.row[sort];
    const valueB = b.row[sort];
    const comparison = sort === 1 ? collator.compare(a.row[2] || valueA, b.row[2] || valueB) : valueA - valueB;
    return sign * comparison || a.index - b.index;
  });
  for (const button of sortButtons) {
    const column = button.closest('th');
    if (Number(button.dataset.sort) === sort) column.setAttribute('aria-sort', descending ? 'descending' : 'ascending');
    else column.removeAttribute('aria-sort');
  }
}

function render() {
  state.maxPage = Math.max(1, Math.ceil(matching.length / state.size));
  state.page = Math.max(1, Math.min(state.page, state.maxPage));
  const start = (state.page - 1) * state.size;
  const page = matching.slice(start, start + state.size);
  const fragment = document.createDocumentFragment();
  for (const record of page) {
    const { row, regions, tags } = record;
    const line = element('tr');
    const rank = element('td', number.format(row[0]), row[0] <= 10 ? 'rank-cell top-rank' : 'rank-cell');
    const name = element('td');
    const button = element('button', row[2] ? row[2] + ' · ' + row[1] : row[1], 'name-button');
    button.type = 'button';
    button.addEventListener('click', () => showDetail(record));
    name.append(button);
    if (row[9]) name.append(element('span', row[9], 'affiliation'));
    const chosen = byId('topic').value;
    const tag = chosen && tags.includes(chosen) ? chosen : tags[0];
    name.append(element('span', tag, 'mobile-topic'));
    const direction = element('td', tag, 'topic-cell');
    direction.title = tags.join('、');
    line.append(rank, name, element('td', regions.join('、'), 'region-cell'), direction);
    for (let i = 4; i <= 7; i++) line.append(element('td', formatScore(row[i]), 'number-cell'));
    const score = element('td', undefined, row[3] === 0 ? 'score-cell quiet' : 'score-cell');
    score.append(element('strong', formatScore(row[3])));
    line.append(score);
    fragment.append(line);
  }
  if (!page.length) {
    const line = element('tr');
    const cell = element('td', '没有匹配结果。请调整关键词或筛选条件。', 'empty');
    cell.colSpan = 9;
    line.append(cell);
    fragment.append(line);
  }
  byId('results').replaceChildren(fragment);
  byId('result-count').textContent = matching.length
    ? '显示 ' + number.format(start + 1) + '–' + number.format(start + page.length) + ' / ' + number.format(matching.length) + ' 条'
    : '共 0 条';
  byId('page-total').textContent = '/ ' + number.format(state.maxPage);
  const pageInput = byId('page-number');
  pageInput.max = state.maxPage;
  pageInput.value = state.page;
  byId('previous').disabled = state.page <= 1;
  byId('next').disabled = state.page >= state.maxPage;
}

function filter() {
  const terms = normalize(byId('query').value).trim().split(/\s+/).filter(Boolean);
  const region = byId('region').value;
  const topic = byId('topic').value;
  const evidence = byId('evidence').value;
  matching = records.filter(record =>
    terms.every(term => record.query.includes(term)) &&
    (!region || record.regions.includes(region)) &&
    (!topic || record.tags.includes(topic)) &&
    (!evidence || (evidence === 'scored') === (record.row[3] > 0))
  );
  state.page = 1;
  sortRecords();
  render();
  renderBrowse();
}

function goToPage(page) {
  state.page = page;
  render();
  if (byId('table-wrap').getBoundingClientRect().top < 0) byId('ranking').scrollIntoView({ block: 'start' });
}

let filterTimer;
byId('query').addEventListener('input', () => {
  clearTimeout(filterTimer);
  filterTimer = setTimeout(filter, 90);
});
for (const id of ['topic', 'region', 'evidence']) byId(id).addEventListener('change', filter);
byId('filters').addEventListener('submit', event => {
  event.preventDefault();
  clearTimeout(filterTimer);
  filter();
});
byId('filters').addEventListener('reset', () => {
  clearTimeout(filterTimer);
  requestAnimationFrame(filter);
});
byId('page-size').addEventListener('change', event => {
  state.size = Number(event.target.value);
  state.page = 1;
  render();
});
byId('previous').addEventListener('click', () => goToPage(state.page - 1));
byId('next').addEventListener('click', () => goToPage(state.page + 1));
byId('jump').addEventListener('submit', event => {
  event.preventDefault();
  const requested = byId('page-number').valueAsNumber;
  if (Number.isInteger(requested)) goToPage(requested);
});
for (const button of sortButtons) {
  button.addEventListener('click', () => {
    const sort = Number(button.dataset.sort);
    state.descending = state.sort === sort ? !state.descending : sort >= 3;
    state.sort = sort;
    state.page = 1;
    sortRecords();
    render();
  });
}
function renderBrowse() {
  const byTopic = state.browse === 'topic';
  byId('browse-topics').setAttribute('aria-pressed', String(byTopic));
  byId('browse-regions').setAttribute('aria-pressed', String(!byTopic));
  const more = byId('browse-more');
  more.setAttribute('aria-expanded', String(state.expanded));
  more.textContent = state.expanded ? '收起分类' : '更多分类';
  const counts = byTopic ? topicCounts : regionCounts;
  const active = byId(state.browse).value;
  const full = byTopic ? [...broad, ...specific, unknownDirection] : regionOptions.map(([name]) => name);
  const visible = state.expanded ? full : full.slice(0, byTopic ? 6 : 8);
  if (active && !visible.includes(active)) visible.push(active);
  const list = byId('browse-list');
  const focused = document.activeElement?.dataset.facet;
  const buttons = visible.filter(name => counts.has(name)).map(name => {
    const button = element('button', undefined, 'browse-chip');
    button.type = 'button';
    button.dataset.facet = name;
    button.setAttribute('aria-pressed', String(active === name));
    button.append(element('span', name), element('span', number.format(counts.get(name)), 'chip-count'));
    button.addEventListener('click', () => {
      byId(state.browse).value = active === name ? '' : name;
      filter();
    });
    return button;
  });
  list.replaceChildren(...buttons);
  if (focused) buttons.find(button => button.dataset.facet === focused)?.focus();
}

for (const [id, kind] of [['browse-topics', 'topic'], ['browse-regions', 'region']]) {
  byId(id).addEventListener('click', () => {
    state.browse = kind;
    state.expanded = false;
    renderBrowse();
  });
}
byId('browse-more').addEventListener('click', () => {
  state.expanded = !state.expanded;
  renderBrowse();
});

filter();
