// ====== CONFIGURA QUESTI VALORI ======
const API_KEY = "patgJP8D7vLtC1PA1.19ec4450820a3f1ee8fe3053adb0a325608ce241c5e8ed3d316d9f0d8290418a";
const BASE_ID = "appmMqXZlrXlGD6HN";
const TABLE = "Corsi";
// ======================================

async function fetchCorsi() {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE}?filterByFormula={pubblicato}=1`;

  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });

  const data = await resp.json();
  return data.records;
}

// LISTA CORSI
if (document.URL.includes("corsi.html")) {
  fetchCorsi().then(corsi => {
    const container = document.getElementById("lista-corsi");
    container.innerHTML = "";

    corsi.forEach(corso => {
      const c = corso.fields;

      container.innerHTML += `
        <div class="card">
          ${c.immagine ? `<img src="${c.immagine}" />` : ""}
          <h3>${c.titolo}</h3>
          <p>${c.descrizione_breve || ""}</p>
          <a class="btn" href="corso.html?id=${corso.id}">Dettagli</a>
        </div>
      `;
    });
  });
}

// PAGINA DETTAGLIO
if (document.URL.includes("corso.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetchCorsi().then(corsi => {
    const corso = corsi.find(c => c.id === id);
    const c = corso.fields;
    const box = document.getElementById("corso-container");

    box.innerHTML = `
      ${c.immagine ? `<img src="${c.immagine}" />` : ""}
      <h2>${c.titolo}</h2>
      <p>${c.descrizione || ""}</p>
      <p><strong>Età:</strong> ${c.eta_min}–${c.eta_max}</p>
      <p><strong>Luogo:</strong> ${c.indirizzo || ""}</p>
      <p><strong>Orario:</strong> ${c.orario || ""}</p>
      <p><strong>Contatti:</strong> ${c.contatto_email || ""}</p>
    `;
  });
}
