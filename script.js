/* ==========================================================
   Portale Maker - script.js (VERSIONE COMPLETA E OTTIMIZZATA)
   ✔ Lista corsi
   ✔ Ricerca
   ✔ Dettaglio corso
   ✔ Immagini Airtable
   ✔ Campi reali (indirizzo, orario, date, ecc.)
========================================================== */

/* ----------------------------------------------------------
   🔑 CONFIGURAZIONE AIRTABLE
---------------------------------------------------------- */
const API_KEY = "patgJP8D7vLtC1PA1.19ec4450820a3f1ee8fe3053adb0a325608ce241c5e8ed3d316d9f0d8290418a";
const BASE_ID = "appmMqXZlrXlGD6HN";
const TABLE = "Corsi";

const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE}`;

/* ----------------------------------------------------------
   📡 FUNZIONE GENERICA DI CHIAMATA API
---------------------------------------------------------- */
async function fetchAirtable(extra = "") {
  const res = await fetch(`${API_URL}${extra}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return await res.json();
}

/* ==========================================================
   📌 LISTA CORSI (corsi.html)
========================================================== */
async function loadCourses() {
  const container = document.getElementById("lista-corsi");
  if (!container) return;

  container.innerHTML = "<p>Caricamento corsi...</p>";

  // Recupera solo corsi pubblicati
  const filter = encodeURIComponent(`pubblicato = 1`);
  const data = await fetchAirtable(`?filterByFormula=${filter}&maxRecords=300`);

  if (!data.records || data.records.length === 0) {
    container.innerHTML = "<p>Nessun corso disponibile.</p>";
    return;
  }

  renderCourses(data.records);
}

/* ----------------------------------------------------------
   🎨 GENERA LE CARDS DEI CORSI
---------------------------------------------------------- */
function renderCourses(records) {
  const container = document.getElementById("lista-corsi");
  container.innerHTML = "";

  records.forEach((rec) => {
    const c = rec.fields;

    const id = rec.id;
    const img = c.immagine ? c.immagine[0].url : "https://via.placeholder.com/600x400?text=Portale+Maker";

    container.innerHTML += `
      <div class="course-card">
        <img src="${img}" alt="${c.titolo}" />
        <div class="course-info">

          <h3 class="course-title">${c.titolo}</h3>

          <p class="course-meta">
            ${c.categoria || ""} • 
            ${c.eta_min || "?"}–${c.eta_max || "?"} anni
          </p>

          <p class="course-meta">${c.indirizzo || ""}</p>

          <a class="btn" href="corso.html?id=${id}">Dettagli</a>
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

  const data = await fetchAirtable(`/${id}`);

  if (!data.fields) {
    container.innerHTML = "<p>Corso non trovato.</p>";
    return;
  }

  renderCourseDetail(data);
}

/* ----------------------------------------------------------
   🎨 RENDER DETTAGLIO CORSO
---------------------------------------------------------- */
function renderCourseDetail(data) {
  const c = data.fields;
  const container = document.getElementById("corso-container");

  const img = c.immagine ? c.immagine[0].url : "";

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
  loadCourses();
  loadCourseDetail();
});
