/* ==========================================================
   Portale Maker - script.js (VERSIONE CON GOOGLE SHEETS)
   ✔ Lista corsi
   ✔ Ricerca
   ✔ Dettaglio corso
   ✔ Immagini
   ✔ Campi reali (indirizzo, orario, date, ecc.)
========================================================== */

/* ----------------------------------------------------------
   🔑 CONFIGURAZIONE GOOGLE SHEETS
---------------------------------------------------------- */
const SHEET_ID = '1hLgAXaANUPl97laG9Qs6sZie39FxYTGZUnu3V84Fjv4'; // Sostituisci con l'ID del tuo Google Sheets
const API_KEY = 'AIzaSyDr_tb8-bpaVFAPj4exphe4WzuYxlM7M1c'; // Sostituisci con la tua API Key
const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Corsi!A2:L?key=${API_KEY}`;

/* ----------------------------------------------------------
   📡 FUNZIONE GENERICA DI CHIAMATA API
---------------------------------------------------------- */
async function fetchGoogleSheets(extra = "") {
  const res = await fetch(`${SHEET_URL}${extra}`);
  return await res.json();
}

/* ==========================================================
   📌 LISTA CORSI (corsi.html)
========================================================== */
async function loadCourses() {
  const container = document.getElementById("lista-corsi");
  if (!container) return;

  container.innerHTML = "<p>Caricamento corsi...</p>";

  // Recupera solo corsi pubblicati (se filtrati da "pubblicato" nel foglio)
  const data = await fetchGoogleSheets();

  if (!data.values || data.values.length === 0) {
    container.innerHTML = "<p>Nessun corso disponibile.</p>";
    return;
  }

  renderCourses(data.values);
}

/* ----------------------------------------------------------
   🎨 GENERA LE CARDS DEI CORSI
---------------------------------------------------------- */
function renderCourses(records) {
  const container = document.getElementById("lista-corsi");
  container.innerHTML = "";

  records.forEach((rec) => {
    const c = {
      titolo: rec[0], // Titolo del corso
      breve_descrizione: rec[1], // Descrizione breve
      descrizione: rec[2], // Descrizione completa
      categoria: rec[3], // Categoria
      eta_min: rec[4], // Età minima
      eta_max: rec[5], // Età massima
      data_inizio: rec[6], // Data inizio
      data_fine: rec[7], // Data fine
      orario: rec[8], // Orario
      indirizzo: rec[9], // Indirizzo
      quartiere: rec[10], // Quartiere
      contatto_email: rec[11], // Email
      contatto_tel: rec[12], // Telefono
      immagine: rec[13] // Immagine (se esiste)
    };

    container.innerHTML += `
      <div class="course-card">
        <img src="${c.immagine || 'https://via.placeholder.com/600x400?text=Portale+Maker'}" alt="${c.titolo}" />
        <div class="course-info">
          <h3 class="course-title">${c.titolo}</h3>
          <p class="course-meta">
            ${c.categoria || ""} • 
            ${c.eta_min || "?"}–${c.eta_max || "?"} anni
          </p>
          <p class="course-meta">${c.indirizzo || ""}</p>
          <a class="btn" href="corso.html?id=${c.titolo}">Dettagli</a>
        </div>
      </div>
    `;
  });
}

/* ----------------------------------------------------------
   🔎 FILTRO RICERCA LIVE
---------------------------------------------------------- */
function filterCourses(q) {
  const cards = document.querySelectorAll(".course-card");
  q = q.toLowerCase();

  cards.forEach((card) => {
    const title = card.querySelector(".course-title").textContent.toLowerCase();
    const meta = card.querySelector(".course-meta").textContent.toLowerCase();

    card.style.display = title.includes(q) || meta.includes(q) ? "block" : "none";
  });
}

/* ==========================================================
   📄 DETTAGLIO CORSO (corso.html)
========================================================== */
async function loadCourseDetail() {
  const container = document.getElementById("corso-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    container.innerHTML = "<p>ID corso non trovato.</p>";
    return;
  }

  const data = await fetchGoogleSheets();

  // Trova il corso specifico nell'array dei corsi
  const course = data.values.find((rec) => rec[0] === id);

  if (!course) {
    container.innerHTML = "<p>Corso non trovato.</p>";
    return;
  }

  renderCourseDetail(course);
}

/* ----------------------------------------------------------
   🎨 RENDER DETTAGLIO CORSO
---------------------------------------------------------- */
function renderCourseDetail(course) {
  const c = {
    titolo: course[0],
    descrizione: course[2],
    categoria: course[3],
    eta_min: course[4],
    eta_max: course[5],
    indirizzo: course[9],
    orario: course[8],
    data_inizio: course[6],
    data_fine: course[7],
    contatto_email: course[11],
    contatto_tel: course[12],
    immagine: course[13] // Se hai un URL immagine
  };

  const container = document.getElementById("corso-container");
  const img = c.immagine ? c.immagine : "";

  container.innerHTML = `
    <div class="course-detail">
      <img src="${img}" class="detail-image" alt="${c.titolo}" />

      <h2>${c.titolo}</h2>

      <p>${c.descrizione || ""}</p>

      <h3>Dettagli</h3>

      <p><strong>Categoria:</strong> ${c.categoria || "—"}</p>
      <p><strong>Età:</strong> ${c.eta_min || "?"}–${c.eta_max || "?"} anni</p>
      <p><strong>Indirizzo:</strong> ${c.indirizzo || "—"}</p>
      <p><strong>Orario:</strong> ${c.orario || "—"}</p>
      <p><strong>Periodo:</strong> ${c.data_inizio || ""} → ${c.data_fine || ""}</p>

      <h3>Contatti</h3>
      <p><strong>Email:</strong> ${c.contatto_email || ""}</p>
      <p><strong>Telefono:</strong> ${c.contatto_tel || ""}</p>
    </div>
  `;
}

/* ==========================================================
   🚀 AUTO-INIT
========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  loadCourses();       // per corsi.html
  loadCourseDetail();  // per corso.html
});
