/* =====================================================================
   ABA CONFIGURAÇÕES — exportar e importar backup
   ===================================================================== */

/* ---------- configurações: importar / exportar ---------- */
function cfgMsg(msg, kind) { const el = $('cfgMsg'); el.textContent = msg || ''; el.className = 'cfg-msg' + (kind ? ' ' + kind : ''); }
function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function stampFile() { const d = new Date(); const p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; }
$('btnExport').addEventListener('click', () => {
  const data = { titulo: RIFA.titulo, exportadoEm: new Date().toISOString(), vendas: serialize() };
  downloadFile(`rifa-backup-${stampFile()}.json`, JSON.stringify(data, null, 2), 'application/json');
  cfgMsg('Backup exportado com sucesso.', 'ok');
});
$('btnExportCsv').addEventListener('click', () => {
  const esc = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
  const rows = [['Numero', 'Nome', 'Pago', 'Data', 'Forma']];
  serialize().forEach(s => rows.push([pad(s.n), s.nome, s.pago ? 'Sim' : 'Nao', fmtDate(s.data), s.forma || '']));
  const csv = '\ufeff' + rows.map(r => r.map(esc).join(';')).join('\r\n');
  downloadFile(`rifa-${stampFile()}.csv`, csv, 'text/csv;charset=utf-8');
  cfgMsg('Planilha exportada com sucesso.', 'ok');
});
$('btnImport').addEventListener('click', () => { cfgMsg(''); $('importFile').click(); });
$('importFile').addEventListener('change', e => {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const raw = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.vendas) ? parsed.vendas : (Array.isArray(parsed.v) ? parsed.v : null));
      if (!raw) throw new Error('formato');
      const clean = raw
        .filter(s => s && Number.isInteger(+s.n) && +s.n >= 1 && +s.n <= RIFA.total)
        .map(s => ({ n: +s.n, nome: String(s.nome || '').trim() || 'Sem nome', pago: !!s.pago, data: s.data || todayISO(), forma: s.forma || null }));
      if (!clean.length) throw new Error('vazio');
      if (!confirm(`Isso vai substituir todas as vendas atuais por ${plural(clean.length, 'venda', 'vendas')} do arquivo. Deseja continuar?`)) { e.target.value = ''; return; }
      loadFrom(clean);
      render(); persist();
      cfgMsg(`${plural(clean.length, 'venda importada', 'vendas importadas')} com sucesso.`, 'ok');
    } catch (err) {
      cfgMsg('Não foi possível ler o arquivo. Verifique se é um backup (.json) válido.', 'err');
    }
    e.target.value = '';
  };
  reader.onerror = () => { cfgMsg('Erro ao ler o arquivo.', 'err'); e.target.value = ''; };
  reader.readAsText(file);
});
