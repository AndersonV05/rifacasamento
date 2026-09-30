/* =====================================================================
   ABA PARTICIPANTES — tabela com busca, filtro e ordenação
   ===================================================================== */

const pchipN = makeChips('pchips', [['todos', 'Todos'], ['pend', 'Com pendência'], ['ok', 'Quitados']], k => { state.pf = k; renderPeople(); });

/* ---------- aba Participantes ---------- */
function renderPeople() {
  const all_ = buildPeople().map(p => ({ ...p, info: pinfo(p) }));
  const q = norm(state.pq), isNum = /^\d+$/.test(q), qn = q.replace(/^0+/, '') || '0';
  let list = all_.filter(p => (state.pf === 'todos' || (state.pf === 'ok' ? p.info.open === 0 : p.info.open > 0))
    && (!q || norm(p.nome).includes(q) || (isNum && p.list.some(s => String(s.n).startsWith(qn)))));
  const by = {
    nome: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
    qtd: (a, b) => b.list.length - a.list.length || a.nome.localeCompare(b.nome, 'pt-BR'),
    falta: (a, b) => b.info.open - a.info.open || a.nome.localeCompare(b.nome, 'pt-BR')
  };
  list.sort(by[state.sort]);

  const nPend = all_.filter(p => p.info.open > 0).length;
  pchipN.todos.textContent = all_.length; pchipN.pend.textContent = nPend; pchipN.ok.textContent = all_.length - nPend;
  document.querySelectorAll('#pchips .chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.f === state.pf));

  const body = $('pbody'); body.innerHTML = '';
  list.forEach(p => {
    const { info } = p, tr = document.createElement('tr');
    const td = (label, cls) => { const c = document.createElement('td'); c.dataset.l = label; if (cls) c.className = cls; tr.appendChild(c); return c; };

    const c1 = td('Participante'); const wc = document.createElement('div'); wc.className = 'who-cell';
    const nm = document.createElement('div'); const b = document.createElement('b'); b.textContent = p.nome;
    const sm = document.createElement('small'); sm.textContent = `${plural(p.list.length, 'número', 'números')} · ${brl.format(p.list.length * RIFA.valor)}`;
    nm.append(b, sm); wc.append(avatar(p.nome), nm); c1.appendChild(wc);

    td('Números').appendChild(numTags(p.list));
    td('Pago', 'r').innerHTML = info.paid ? `<span class="money">${brl.format(info.paid * RIFA.valor)}</span>` : '<span class="muted">—</span>';
    td('Falta', 'r').innerHTML = info.open ? `<span class="money">${brl.format(info.open * RIFA.valor)}</span>` : '<span class="muted">—</span>';
    td('Forma').textContent = info.formas.length ? info.formas.join(' e ') : '—';
    td('Situação').appendChild(badge(info.status));
    const act = td('Ação');
    if (info.open > 0) {
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'mini';
      btn.textContent = 'Marcar como pago';
      btn.addEventListener('click', () => openPayAll(p));
      act.appendChild(btn);
    }
    body.appendChild(tr);
  });
  $('pempty').hidden = list.length > 0;
  $('pemptyMsg').textContent = all_.length ? 'Nenhum participante encontrado.' : 'Ainda não há participantes. Registre uma venda na aba Números.';
}
$('pq').addEventListener('input', e => { state.pq = e.target.value; renderPeople(); });
$('psort').addEventListener('change', e => { state.sort = e.target.value; renderPeople(); });
$('pReset').addEventListener('click', () => { state.pq = ''; state.pf = 'todos'; $('pq').value = ''; renderPeople(); });
