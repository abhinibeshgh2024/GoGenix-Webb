let chart = null;

function generateChart() {
  const labelsInput = document.getElementById("labels").value;
  const valuesInput = document.getElementById("values").value;
  const type = document.getElementById("chartType").value;
  const errorBox = document.getElementById("error");

  errorBox.innerText = "";

  if (!labelsInput || !valuesInput) {
    errorBox.innerText = "Please enter labels and values.";
    return;
  }

  const labels = labelsInput.split(",").map(l => l.trim());
  const values = valuesInput.split(",").map(v => Number(v.trim()));

  if (labels.length !== values.length) {
    errorBox.innerText = "Labels and values count must match.";
    return;
  }

  if (values.some(isNaN)) {
    errorBox.innerText = "Values must be numeric only.";
    return;
  }

  const canvas = document.getElementById("chartCanvas");
  const ctx = canvas.getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [{
        label: "AI Chart Data",
        data: values,
        backgroundColor: "#00bfff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
