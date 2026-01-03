// Create the search bar dynamically above navbar
const header = document.querySelector('body');
const searchContainer = document.createElement('div');
searchContainer.id = 'webbSearchContainer';
searchContainer.innerHTML = `
 <input type="text" id="webbSearchInput"  placeholder="Search G4G..."/>
  <div id="webbSearchResults"></div>
`;
document.body.insertBefore(searchContainer, document.querySelector('nav'));

// List of Webb tools from navbar
const webbTools = [
  { name: "Advanced Resume Builder", link: "indexrb.html" },
  { name: "Chart Maker", link: "chart.html" },
  { name: "Whiteboard", link: "whiteboard.html" }
 { name: "Fronto (HTML.CSS.JS)", link: "fronto.html" }
{ name: "HTML/CSS Editor", link: "codex.html" }
{ name: "Art Gallery", link: "unigallery.html" }
];

// DOM Elements
const searchInput = document.getElementById('webbSearchInput');
const searchResults = document.getElementById('webbSearchResults');

// Function to update results dynamically
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  searchResults.innerHTML = '';
  if (query.length === 0) {
    searchResults.style.display = 'none';
    return;
  }

  const matches = webbTools.filter(tool => tool.name.toLowerCase().includes(query));

  matches.forEach(tool => {
    const div = document.createElement('div');
    div.textContent = tool.name;
    div.onclick = () => {
      window.location.href = tool.link;
    };
    searchResults.appendChild(div);
  });

  searchResults.style.display = matches.length ? 'block' : 'none';
});

// Close suggestions if click outside
document.addEventListener('click', (e) => {
  if (!searchContainer.contains(e.target)) {
    searchResults.style.display = 'none';
  }
});
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const today = new Date().toISOString().split("T")[0];
const sessionId = Math.random().toString(36).substring(2);

// ---------- COUNTRY DETECTION ----------
async function getCountry() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return data.country_name || "Unknown";
  } catch {
    return "Unknown";
  }
}

// ---------- REGISTER VISIT ----------
async function registerVisit() {
  const country = await getCountry();

  await setDoc(doc(db, "visits", today, "users", sessionId), {
    country,
    time: serverTimestamp()
  });

  await setDoc(doc(db, "liveUsers", sessionId), {
    time: Date.now()
  });
}

// ---------- LIVE USERS ----------
async function loadLiveUsers() {
  const snapshot = await getDocs(collection(db, "liveUsers"));
  const now = Date.now();
  let active = 0;

  snapshot.forEach(doc => {
    if (now - doc.data().time < 60000) active++;
  });

  document.getElementById("liveUsers").innerText = active;
}

// ---------- GRAPH ----------
async function loadGraph() {
  const snap = await getDocs(collection(db, "visits"));
  const labels = [];
  const data = [];

  snap.forEach(doc => {
    labels.push(doc.id);
    data.push(doc.data().count || 1);
  });

  new Chart(document.getElementById("visitorChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Daily Visitors",
        data,
        borderColor: "#00ff88",
        fill: false,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

// ---------- COUNTRY LIST ----------
async function loadCountries() {
  const snap = await getDocs(collection(db, "visits", today, "users"));
  const map = {};

  snap.forEach(doc => {
    const c = doc.data().country;
    map[c] = (map[c] || 0) + 1;
  });

  const container = document.getElementById("countryList");
  container.innerHTML = "";

  for (let c in map) {
    const div = document.createElement("div");
    div.innerText = `${c}: ${map[c]}`;
    container.appendChild(div);
  }
}

// ---------- INIT ----------
registerVisit();
loadLiveUsers();
loadGraph();
loadCountries();
setInterval(loadLiveUsers, 10000);



