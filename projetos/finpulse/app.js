/* ============================================================
   FinPulse — lógica do dashboard
   CRUD de transações + localStorage + Chart.js
   ============================================================ */

'use strict';

const STORAGE_KEY = 'finpulse.transactions.v1';

/* ---------- Categorias ---------- */
const CATEGORIES = {
  expense: ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação', 'Compras', 'Outros'],
  income: ['Salário', 'Freelance', 'Investimentos', 'Presente', 'Outros'],
};

const CAT_ICON = {
  'Alimentação': '🍽', 'Transporte': '🚗', 'Moradia': '🏠', 'Lazer': '🎮',
  'Saúde': '＋', 'Educação': '📚', 'Compras': '🛍', 'Outros': '•',
  'Salário': '💼', 'Freelance': '💻', 'Investimentos': '📈', 'Presente': '🎁',
};

/* ---------- Estado ---------- */
let transactions = load();
let filters = { month: 'all', type: 'all', search: '' };
let charts = { bar: null, doughnut: null, line: null };

/* ---------- Helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const fmtBRL = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

const monthKey = (iso) => iso.slice(0, 7); // "2026-07"
const monthLabel = (key) => {
  const [y, m] = key.split('-');
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '');
};

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
const SERIES = () => [1, 2, 3, 4, 5, 6, 7, 8].map((i) => cssVar(`--series-${i}`));

/* ---------- Persistência ---------- */
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

/* ---------- Filtros ---------- */
function filtered() {
  const q = filters.search.toLowerCase();
  return transactions
    .filter((t) => filters.month === 'all' || monthKey(t.date) === filters.month)
    .filter((t) => filters.type === 'all' || t.type === filters.type)
    .filter((t) => !q || t.desc.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
}

// Escopo por período (ignora busca/tipo) — base dos cards e gráficos por categoria
function periodScope() {
  return transactions.filter((t) => filters.month === 'all' || monthKey(t.date) === filters.month);
}

/* ============================================================
   RENDER
   ============================================================ */
function render() {
  renderMonthFilter();
  renderStats();
  renderTable();
  renderCharts();
}

/* ---------- Filtro de mês ---------- */
function renderMonthFilter() {
  const sel = $('#monthFilter');
  const months = [...new Set(transactions.map((t) => monthKey(t.date)))].sort().reverse();
  const current = filters.month;
  sel.innerHTML =
    '<option value="all">Todos os meses</option>' +
    months.map((m) => `<option value="${m}">${monthLabel(m)}</option>`).join('');
  sel.value = months.includes(current) || current === 'all' ? current : 'all';
  filters.month = sel.value;
}

/* ---------- Stat tiles ---------- */
function renderStats() {
  const scope = periodScope();
  const income = scope.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = scope.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const rate = income > 0 ? Math.round((balance / income) * 100) : 0;

  $('#statBalance').textContent = fmtBRL(balance);
  $('#statIncome').textContent = fmtBRL(income);
  $('#statExpense').textContent = fmtBRL(expense);
  $('#statRate').textContent = `${rate}%`;

  const badge = $('#balanceBadge');
  badge.textContent = balance >= 0 ? '▲ positivo' : '▼ negativo';
  badge.classList.toggle('is-negative', balance < 0);

  $('#balanceMeta').textContent = scope.length
    ? `${scope.length} movimentações no período`
    : 'Sem movimentações';
  $('#incomeMeta').textContent = `${scope.filter((t) => t.type === 'income').length} entradas`;
  $('#expenseMeta').textContent = `${scope.filter((t) => t.type === 'expense').length} saídas`;
  $('#rateMeta').textContent = rate >= 0 ? 'do que você recebeu' : 'gastou mais do que recebeu';
}

/* ---------- Tabela ---------- */
function renderTable() {
  const rows = filtered();
  const body = $('#txBody');
  const empty = $('#emptyState');
  $('#txCount').textContent = `${rows.length} ${rows.length === 1 ? 'registro' : 'registros'}`;

  if (!rows.length) {
    body.innerHTML = '';
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  body.innerHTML = rows
    .map((t) => {
      const sign = t.type === 'income' ? '+' : '−';
      const icon = CAT_ICON[t.category] || '•';
      const date = new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short',
      });
      return `
      <tr data-id="${t.id}">
        <td>
          <div class="tx-desc">
            <span class="tx-ic tx-ic--${t.type}">${icon}</span>
            <span>${escapeHtml(t.desc)}</span>
          </div>
        </td>
        <td><span class="cat-tag">${escapeHtml(t.category)}</span></td>
        <td>${date}</td>
        <td class="num amount--${t.type}">${sign} ${fmtBRL(t.amount)}</td>
        <td class="num">
          <div class="row-actions">
            <button class="icon-btn" data-edit="${t.id}" aria-label="Editar" title="Editar">✎</button>
            <button class="icon-btn" data-del="${t.id}" aria-label="Excluir" title="Excluir">🗑</button>
          </div>
        </td>
      </tr>`;
    })
    .join('');
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ============================================================
   CHARTS
   ============================================================ */
function baseChartOpts() {
  Chart.defaults.color = cssVar('--text-secondary');
  Chart.defaults.font.family = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0b0f1a',
        borderColor: cssVar('--stroke-strong'),
        borderWidth: 1,
        padding: 10,
        titleColor: cssVar('--text-primary'),
        bodyColor: cssVar('--text-secondary'),
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y ?? ctx.parsed;
            return `  ${fmtBRL(v)}`;
          },
        },
      },
    },
  };
}

function renderCharts() {
  if (typeof Chart === 'undefined') return; // Chart.js não carregou (offline) — app segue funcionando
  renderBarChart();
  renderDoughnut();
  renderLineChart();
}

/* Receitas vs Despesas por mês (últimos 6) */
function renderBarChart() {
  const months = [...new Set(transactions.map((t) => monthKey(t.date)))].sort().slice(-6);
  const income = months.map((m) =>
    transactions.filter((t) => t.type === 'income' && monthKey(t.date) === m).reduce((s, t) => s + t.amount, 0)
  );
  const expense = months.map((m) =>
    transactions.filter((t) => t.type === 'expense' && monthKey(t.date) === m).reduce((s, t) => s + t.amount, 0)
  );

  const data = {
    labels: months.map(monthLabel),
    datasets: [
      { label: 'Receitas', data: income, backgroundColor: cssVar('--income'), borderRadius: 6, maxBarThickness: 26 },
      { label: 'Despesas', data: expense, backgroundColor: cssVar('--expense'), borderRadius: 6, maxBarThickness: 26 },
    ],
  };
  const opts = {
    ...baseChartOpts(),
    plugins: { ...baseChartOpts().plugins, legend: { display: true, position: 'top', labels: { usePointStyle: true, boxWidth: 8, padding: 16 } } },
    scales: {
      x: { grid: { display: false }, border: { color: cssVar('--axis') } },
      y: { grid: { color: cssVar('--grid') }, border: { display: false }, ticks: { callback: (v) => 'R$ ' + v } },
    },
  };

  if (charts.bar) {
    charts.bar.data = data;
    charts.bar.update();
  } else {
    charts.bar = new Chart($('#barChart'), { type: 'bar', data, options: opts });
  }
}

/* Despesas por categoria (período) */
function renderDoughnut() {
  const scope = periodScope().filter((t) => t.type === 'expense');
  const byCat = {};
  scope.forEach((t) => (byCat[t.category] = (byCat[t.category] || 0) + t.amount));
  const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const colors = SERIES();

  const labels = entries.map((e) => e[0]);
  const values = entries.map((e) => e[1]);
  const total = values.reduce((s, v) => s + v, 0);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        borderColor: cssVar('--bg-1'),
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };
  const opts = {
    ...baseChartOpts(),
    cutout: '62%',
    plugins: {
      ...baseChartOpts().plugins,
      tooltip: {
        ...baseChartOpts().plugins.tooltip,
        callbacks: {
          label: (ctx) => {
            const pct = total ? Math.round((ctx.parsed / total) * 100) : 0;
            return `  ${fmtBRL(ctx.parsed)} · ${pct}%`;
          },
        },
      },
    },
  };

  if (charts.doughnut) {
    charts.doughnut.data = data;
    charts.doughnut.update();
  } else {
    charts.doughnut = new Chart($('#doughnutChart'), { type: 'doughnut', data, options: opts });
  }

  // Legenda customizada com valores
  const legend = $('#doughnutLegend');
  legend.innerHTML = entries.length
    ? entries
        .map(
          ([cat, val], i) => `
      <li>
        <span class="swatch" style="background:${colors[i % colors.length]}"></span>
        <span>${escapeHtml(cat)}</span>
        <span class="legend__val">${fmtBRL(val)}</span>
      </li>`
        )
        .join('')
    : '<li style="color:var(--text-muted)">Sem despesas no período.</li>';
}

/* Evolução do saldo acumulado */
function renderLineChart() {
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  let running = 0;
  const points = new Map(); // date -> saldo acumulado
  sorted.forEach((t) => {
    running += t.type === 'income' ? t.amount : -t.amount;
    points.set(t.date, running);
  });
  const labels = [...points.keys()];
  const values = [...points.values()];

  const canvas = $('#lineChart');
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 260);
  grad.addColorStop(0, 'rgba(51, 225, 237, 0.35)');
  grad.addColorStop(1, 'rgba(51, 225, 237, 0)');

  const data = {
    labels: labels.map((d) => new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })),
    datasets: [
      {
        label: 'Saldo',
        data: values,
        borderColor: cssVar('--neon-cyan'),
        backgroundColor: grad,
        borderWidth: 2,
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: cssVar('--neon-cyan'),
      },
    ],
  };
  const opts = {
    ...baseChartOpts(),
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: { grid: { display: false }, border: { color: cssVar('--axis') }, ticks: { maxTicksLimit: 8 } },
      y: { grid: { color: cssVar('--grid') }, border: { display: false }, ticks: { callback: (v) => 'R$ ' + v } },
    },
  };

  if (charts.line) {
    charts.line.data = data;
    charts.line.update();
  } else {
    charts.line = new Chart(canvas, { type: 'line', data, options: opts });
  }
}

/* ============================================================
   CRUD
   ============================================================ */
function addTransaction(tx) {
  transactions.push({ ...tx, id: uid(), createdAt: Date.now() });
  save();
  render();
}
function updateTransaction(id, patch) {
  const i = transactions.findIndex((t) => t.id === id);
  if (i > -1) {
    transactions[i] = { ...transactions[i], ...patch };
    save();
    render();
  }
}
/* ============================================================
   UI FEEDBACK — toasts, confirmação e acessibilidade
   ============================================================ */

/**
 * Exibe um toast temporário.
 * @param {string} message
 * @param {{type?: 'success'|'error'|'info', duration?: number, action?: {label: string, onClick: Function}}} [opts]
 */
function showToast(message, opts = {}) {
  const { type = 'info', duration = 4000, action } = opts;
  const container = $('#toasts');
  const icons = { success: '✓', error: '!', info: 'ℹ' };

  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.innerHTML = `<span class="toast__icon" aria-hidden="true">${icons[type]}</span><span class="toast__msg"></span>`;
  el.querySelector('.toast__msg').textContent = message;

  let timer;
  const dismiss = () => {
    if (el.classList.contains('is-leaving')) return;
    clearTimeout(timer);
    el.classList.add('is-leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 300); // fallback se animação não disparar
  };

  if (action) {
    const btn = document.createElement('button');
    btn.className = 'toast__action';
    btn.type = 'button';
    btn.textContent = action.label;
    btn.addEventListener('click', () => { action.onClick(); dismiss(); });
    el.appendChild(btn);
  }

  const close = document.createElement('button');
  close.className = 'toast__close';
  close.type = 'button';
  close.setAttribute('aria-label', 'Fechar');
  close.textContent = '✕';
  close.addEventListener('click', dismiss);
  el.appendChild(close);

  container.appendChild(el);
  timer = setTimeout(dismiss, duration);
  return dismiss;
}

/**
 * Diálogo de confirmação acessível. Resolve true/false.
 * @returns {Promise<boolean>}
 */
function confirmDialog(opts = {}) {
  const { title = 'Confirmar', message = '', okLabel = 'Confirmar', danger = true } = opts;
  return new Promise((resolve) => {
    const cm = $('#confirmModal');
    $('#confirmTitle').textContent = title;
    $('#confirmMsg').textContent = message;
    const okBtn = $('#confirmOk');
    okBtn.textContent = okLabel;
    okBtn.className = danger ? 'btn btn--danger' : 'btn btn--primary';

    const opener = document.activeElement;
    cm.hidden = false;
    okBtn.focus();
    const release = trapFocus(cm.querySelector('.modal__panel'));

    const cleanup = (result) => {
      release();
      cm.hidden = true;
      cm.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      okBtn.removeEventListener('click', onOk);
      if (opener && opener.focus) opener.focus();
      resolve(result);
    };
    const onOk = () => cleanup(true);
    const onClick = (e) => { if (e.target.hasAttribute('data-confirm-cancel')) cleanup(false); };
    const onKey = (e) => { if (e.key === 'Escape') cleanup(false); };

    okBtn.addEventListener('click', onOk);
    cm.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
  });
}

/**
 * Prende o Tab dentro de um painel (focus trap). Retorna função de liberação.
 * @param {HTMLElement} panel
 */
function trapFocus(panel) {
  const SEL = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const onKey = (e) => {
    if (e.key !== 'Tab') return;
    const els = [...panel.querySelectorAll(SEL)].filter((el) => el.offsetParent !== null);
    if (!els.length) return;
    const first = els[0];
    const last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  panel.addEventListener('keydown', onKey);
  return () => panel.removeEventListener('keydown', onKey);
}

/* ---------- Validação inline ---------- */
function clearErrors() {
  document.querySelectorAll('.field.has-error').forEach((f) => f.classList.remove('has-error'));
  document.querySelectorAll('[data-error]').forEach((e) => (e.textContent = ''));
}
function setError(inputId, msg) {
  const input = $('#' + inputId);
  const field = input.closest('.field');
  field.classList.add('has-error');
  const err = field.querySelector('[data-error]');
  if (err) err.textContent = msg;
}
function validateTx(tx) {
  clearErrors();
  let ok = true;
  if (!tx.desc) { setError('descInput', 'Informe uma descrição.'); ok = false; }
  if (!tx.amount || isNaN(tx.amount) || tx.amount <= 0) { setError('amountInput', 'O valor deve ser maior que zero.'); ok = false; }
  if (!tx.date) { setError('dateInput', 'Escolha uma data.'); ok = false; }
  return ok;
}

/* ============================================================
   MODAL
   ============================================================ */
const modal = $('#modal');
let modalOpener = null;
let releaseModalTrap = null;

function openModal(tx = null) {
  $('#modalTitle').textContent = tx ? 'Editar transação' : 'Nova transação';
  $('#submitBtn').textContent = tx ? 'Atualizar' : 'Salvar';
  $('#txId').value = tx ? tx.id : '';

  const type = tx ? tx.type : 'expense';
  document.querySelector(`input[name="type"][value="${type}"]`).checked = true;
  $('#descInput').value = tx ? tx.desc : '';
  $('#amountInput').value = tx ? tx.amount : '';
  $('#dateInput').value = tx ? tx.date : new Date().toISOString().slice(0, 10);
  fillCategories(type, tx ? tx.category : null);
  clearErrors();

  modalOpener = document.activeElement;
  modal.hidden = false;
  setTimeout(() => $('#descInput').focus(), 50);
  releaseModalTrap = trapFocus(modal.querySelector('.modal__panel'));
}
function closeModal() {
  if (releaseModalTrap) { releaseModalTrap(); releaseModalTrap = null; }
  modal.hidden = true;
  $('#txForm').reset();
  clearErrors();
  if (modalOpener && modalOpener.focus) modalOpener.focus();
  modalOpener = null;
}

function fillCategories(type, selected) {
  const sel = $('#categoryInput');
  sel.innerHTML = CATEGORIES[type].map((c) => `<option value="${c}">${c}</option>`).join('');
  if (selected) sel.value = selected;
}

/* ============================================================
   EVENTOS
   ============================================================ */
function bindEvents() {
  $('#addBtn').addEventListener('click', () => openModal());
  $('#emptyAddBtn').addEventListener('click', () => openModal());

  // Fechar modal
  modal.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // Alternar categorias ao trocar o tipo no modal
  document.querySelectorAll('input[name="type"]').forEach((r) =>
    r.addEventListener('change', (e) => fillCategories(e.target.value, null))
  );

  // Submit do formulário
  $('#txForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const tx = {
      type: document.querySelector('input[name="type"]:checked').value,
      desc: $('#descInput').value.trim(),
      amount: Math.abs(parseFloat($('#amountInput').value)),
      date: $('#dateInput').value,
      category: $('#categoryInput').value,
    };
    if (!validateTx(tx)) {
      const firstErr = document.querySelector('.field.has-error input');
      if (firstErr) firstErr.focus();
      return;
    }

    const id = $('#txId').value;
    if (id) {
      updateTransaction(id, tx);
      showToast('Transação atualizada.', { type: 'success' });
    } else {
      addTransaction(tx);
      showToast('Transação adicionada.', { type: 'success' });
    }
    closeModal();
  });

  // Limpa o erro do campo assim que o usuário corrige
  ['descInput', 'amountInput', 'dateInput'].forEach((id) => {
    $('#' + id).addEventListener('input', (e) => {
      const field = e.target.closest('.field');
      if (field?.classList.contains('has-error')) {
        field.classList.remove('has-error');
        field.querySelector('[data-error]').textContent = '';
      }
    });
  });

  // Ações na tabela (delegação)
  $('#txBody').addEventListener('click', (e) => {
    const editId = e.target.closest('[data-edit]')?.getAttribute('data-edit');
    const delId = e.target.closest('[data-del]')?.getAttribute('data-del');
    if (editId) openModal(transactions.find((t) => t.id === editId));
    if (delId) {
      const idx = transactions.findIndex((t) => t.id === delId);
      if (idx === -1) return;
      const [removed] = transactions.splice(idx, 1);
      save();
      render();
      showToast(`"${removed.desc}" excluída.`, {
        type: 'error',
        duration: 6000,
        action: {
          label: 'Desfazer',
          onClick: () => {
            transactions.splice(Math.min(idx, transactions.length), 0, removed);
            save();
            render();
            showToast('Exclusão desfeita.', { type: 'success' });
          },
        },
      });
    }
  });

  // Filtros
  $('#monthFilter').addEventListener('change', (e) => {
    filters.month = e.target.value;
    render();
  });
  $('#searchInput').addEventListener('input', (e) => {
    filters.search = e.target.value;
    renderTable();
  });
  document.querySelectorAll('.seg').forEach((btn) =>
    btn.addEventListener('click', () => {
      document.querySelectorAll('.seg').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      filters.type = btn.getAttribute('data-type');
      renderTable();
    })
  );

  // Dados de exemplo
  $('#seedBtn').addEventListener('click', async () => {
    if (transactions.length) {
      const ok = await confirmDialog({
        title: 'Adicionar exemplos?',
        message: 'Isso insere transações de exemplo junto com as suas. Deseja continuar?',
        okLabel: 'Adicionar',
        danger: false,
      });
      if (!ok) return;
    }
    transactions = transactions.concat(sampleData());
    save();
    render();
    showToast('Dados de exemplo carregados.', { type: 'info' });
  });
}

/* ============================================================
   DADOS DE EXEMPLO
   ============================================================ */
function sampleData() {
  const today = new Date();
  const iso = (offsetDays) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offsetDays);
    return d.toISOString().slice(0, 10);
  };
  const raw = [
    ['income', 'Salário', 'Salário', 5200, 2],
    ['income', 'Projeto freelance', 'Freelance', 1800, 8],
    ['expense', 'Aluguel', 'Moradia', 1500, 5],
    ['expense', 'Supermercado', 'Alimentação', 620, 4],
    ['expense', 'Uber', 'Transporte', 85, 3],
    ['expense', 'Netflix + Spotify', 'Lazer', 55, 10],
    ['expense', 'Farmácia', 'Saúde', 130, 12],
    ['expense', 'Curso online', 'Educação', 197, 15],
    ['income', 'Salário', 'Salário', 5200, 33],
    ['expense', 'Aluguel', 'Moradia', 1500, 35],
    ['expense', 'Restaurante', 'Alimentação', 210, 28],
    ['expense', 'Gasolina', 'Transporte', 240, 25],
    ['expense', 'Tênis novo', 'Compras', 380, 22],
    ['income', 'Dividendos', 'Investimentos', 140, 20],
  ];
  return raw.map(([type, desc, category, amount, days]) => ({
    id: uid(),
    type,
    desc,
    category,
    amount,
    date: iso(days),
    createdAt: Date.now() - days * 1000,
  }));
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  bindEvents();
  // Primeiro acesso sem dados → carrega exemplos pra não abrir vazio
  if (!transactions.length) {
    transactions = sampleData();
    save();
  }
  render();
}

document.addEventListener('DOMContentLoaded', init);
