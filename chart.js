let chart;
const datasetsDiv = document.getElementById("datasets");
const errorBox = document.getElementById("error");

addDataset();

function addDataset() {
  const ds = document.createElement("div");
  ds.className = "dataset";

  ds.innerHTML = `
    <label>Dataset Label</label>
    <input class="ds-label" placeholder="Dataset name">

    <label>Color</label>
    <input type="color" class="ds-color" value="#2563eb">

    <div class="rows"></div>
    <button onclick="addRow(this)">➕ Add Data Row</button>
  `;

  datasetsDiv.appendChild(ds);
  addRow(ds.querySelector("button"));
}

function addRow(btn) {
  const rows = btn.previousElementSibling;
  const row = document.createElement("div");
  row.className = "data-row";
  row.innerHTML = `
    <input placeholder="Label">
    <input type="number" placeholder="Value">
  `;
  rows.appendChild(row);
}

function generateChart() {
  errorBox.textContent = "";

  const type = document.getElementById("chartType").value;
  const title = document.getElementById("chartTitle").value;

  let labels = [];
  let datasets = [];

  document.querySelectorAll(".dataset").forEach(ds => {
    const label = ds.querySelector(".ds-label").value;
    const color = ds.querySelector(".ds-color").value;
    const rows = ds.querySelectorAll(".data-row");

    let data = [];
    rows.forEach(r => {
      const l = r.children[0].value;
      const v = r.children[1].value;
      if (l && v) {
        if (!labels.includes(l)) labels.push(l);
        data.push(Number(v));
      }
    });

    if (data.length) {
      datasets.push({
        label,
        data,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 2,
        fill: false
      });
    }
  });

  if (!datasets.length) {
    errorBox.textContent = "Please add at least one dataset.";
    return;
  }

  if (chart) chart.destroy();

  chart = new Chart(chartCanvas, {
    type,
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        title: { display: !!title, text: title }
      }
    }
  });
}

function exportPDF() {
  window.print();
}
