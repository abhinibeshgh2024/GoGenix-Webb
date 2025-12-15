let chartInstance = null;

// PAGE LOAD HOTE HI EK ROW
window.onload = function () {
  addRow();
};

function addRow() {
  const table = document.getElementById("dataTable");

  const row = document.createElement("div");
  row.className = "row";

  const labelInput = document.createElement("input");
  labelInput.type = "text";
  labelInput.placeholder = "Label";

  const valueInput = document.createElement("input");
  valueInput.type = "number";
  valueInput.placeholder = "Value";

  row.appendChild(labelInput);
  row.appendChild(valueInput);
  table.appendChild(row);
}

function generateChart() {
  const rows = document.querySelectorAll(".row");
  const labels = [];
  const values = [];

  const title = document.getElementById("chartTitle").value;
  const desc = document.getElementById("chartDesc").value;
  const type = document.getElementById("chartType").value;
  const errorBox = document.getElementById("error");

  errorBox.innerText = "";

  rows.forEach(row => {
    const label = row.children[0].value.trim();
    const value = row.children[1].value;

    if (label !== "" && value !== "") {
      labels.push(label);
      values.push(Number(value));
    }
  });

  if (labels.length === 0) {
    errorBox.innerText = "At least one valid data row is required.";
    return;
  }

  const ctx = document.getElementById("chartCanvas").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [{
        label: desc || "Chart Data",
        data: values,
        backgroundColor: "#00bfff",
        borderColor: "#00bfff"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title || "Chart Maker Output"
        },
        legend: {
          display: true
        }
      }
    }
  });
}
