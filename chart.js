let chart;
const rows = document.getElementById("rows");

addRow();

function addRow() {
  const row = document.createElement("div");
  row.className = "data-row";
  row.innerHTML = `
    <input placeholder="Label">
    <input type="number" placeholder="Value">
  `;
  rows.appendChild(row);
}

function generateChart() {
  const labels = [];
  const data = [];

  document.querySelectorAll(".data-row").forEach(r => {
    const label = r.children[0].value;
    const value = r.children[1].value;
    if (label && value) {
      labels.push(label);
      data.push(Number(value));
    }
  });

  if (!data.length) return;

  if (chart) chart.destroy();

  chart = new Chart(chartCanvas, {
    type: chartType.value,
    data: {
      labels,
      datasets: [{
        label: chartTitle.value || "Data",
        data,
        backgroundColor: generateColors(data.length),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: chartTitle.value
        }
      }
    }
  });
}

function generateColors(count) {
  const baseColors = [
    "#2563eb", "#16a34a", "#dc2626",
    "#9333ea", "#f59e0b", "#0ea5e9",
    "#14b8a6", "#e11d48"
  ];
  return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
}

function downloadPDF() {
  window.print();
}
