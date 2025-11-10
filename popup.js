const XPATH = '//*[@id="main"]/header/div[2]/div[2]/span';

const $ = (sel) => document.querySelector(sel);
const output = $("#output");
const meta = $("#meta");
const toast = $("#toast");

$("#btn-extract").addEventListener("click", runExtraction);
$("#search").addEventListener("input", onSearch);
$("#btn-copy-csv").addEventListener("click", () => copyText(renderCSV(currentRows)));
$("#btn-copy-md").addEventListener("click", () => copyText(renderMarkdown(currentRows)));
$("#btn-dl-csv").addEventListener("click", () => downloadFile("tabela.csv", renderCSV(currentRows)));
$("#btn-dl-md").addEventListener("click", () => downloadFile("tabela.md", renderMarkdown(currentRows)));

let allRows = [];
let currentRows = [];
let lastExtractionAt = null;

async function runExtraction() {
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractNumbersFromXPath,
      args: [XPATH]
    });

    const rows = (results && results[0] && results[0].result) || [];
    allRows = rows;
    currentRows = rows;
    lastExtractionAt = new Date();
    renderTable(currentRows);
    updateMeta(rows.length);
    if (!rows.length) showToast("Nenhum número encontrado. Abra um grupo e tente novamente.");
  } catch (e) {
    showToast("Erro ao extrair. Abra o WhatsApp Web e um grupo.", true);
    console.error(e);
  }
}

function onSearch(e) {
  const q = e.target.value.trim().toLowerCase();
  currentRows = !q
    ? allRows
    : allRows.filter(r =>
        r.numero.toLowerCase().includes(q) ||
        r.modd.toLowerCase().includes(q) ||
        r.link.toLowerCase().includes(q)
      );
  renderTable(currentRows);
  updateMeta(currentRows.length, { filtered: Boolean(q) });
}

function renderTable(rows) {
  if (!rows.length) {
    output.innerHTML = "";
    return;
  }
  const html = `
    <table class="table">
      <thead>
        <tr>
          <th>Número</th>
          <th>Modd</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td>${escapeHTML(r.numero)}</td>
            <td>${escapeHTML(r.modd)}</td>
            <td><a href="${r.link}" target="_blank">${r.link}</a></td>
          </tr>
        `).join("")}
      </tbody>
    </table>`;
  output.innerHTML = html;
}

/* ---------- Export helpers ---------- */
function renderCSV(rows) {
  const header = "numero,modd,link\n";
  const lines = rows.map(r => {
    const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
    return [q(r.numero), q(r.modd), q(r.link)].join(",");
  });
  return header + lines.join("\n");
}

function renderMarkdown(rows) {
  const header = "| numero | modd | link |\n| --- | --- | --- |\n";
  const lines = rows.map(r => `| ${r.numero} | ${r.modd} | ${r.link} |`);
  return header + lines.join("\n");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copiado para a área de transferência.");
  } catch {
    showToast("Não foi possível copiar.", true);
  }
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  showToast(`Arquivo “${filename}” baixado.`);
}

function showToast(msg, danger=false) {
  toast.textContent = msg;
  toast.style.borderColor = danger ? "var(--danger)" : "var(--line)";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
  );
}

/* ---------- Função que roda na aba do WhatsApp ---------- */
function extractNumbersFromXPath(xpath) {
  const PAT = /\+55\s*\d{2}\s*(?:\d[\d\s-]*)\d/g;

  const el = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  if (!el) return [];

  const text = (el.innerText || el.textContent || "").trim();
  const matches = text.match(PAT) || [];

  function normalizeLocal(localDigits) {
    if (localDigits.length === 8) return "9" + localDigits;
    return localDigits;
  }

  return matches.map((numero) => {
    const digits = numero.replace(/\D/g, ""); // +55DDxxxxxxxx
    const ddd = digits.slice(2, 4);
    let local = digits.slice(4);
    local = normalizeLocal(local);
    return {
      numero,
      modd: `${ddd}${local}`,
      link: `https://wa.me/55${ddd}${local}`
    };
  });
}

function updateMeta(count, { filtered = false } = {}) {
  const timestampHtml = lastExtractionAt
    ? ` <span style="opacity:.6">${formatTimestamp(lastExtractionAt)}</span>`
    : "";
  const filteredSuffix = filtered ? " (filtrado)" : "";
  meta.innerHTML = `${count} contatos${filteredSuffix}${timestampHtml}`;
}

function formatTimestamp(date) {
  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  });
}
