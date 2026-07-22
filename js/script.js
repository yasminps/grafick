// Grafick — catálogo/vitrine
const WHATS_NUMBER = "5598985177930";

function waLink(message) {
  return `https://wa.me/${WHATS_NUMBER}?text=${encodeURIComponent(message)}`;
}

function img(name) {
  return `imagens/${encodeURIComponent(name)}`;
}

const products = {
  agendas: {
    badge: "Agenda",
    items: [
      { file: "agenda 1.png", title: "Adria Doces" },
      { file: "agenda 2.png", title: "Heloise" },
      { file: "agenda 3.png", title: "Elisângela" },
      { file: "agenda 4.png", title: "Desbravar Viagens" },
      { file: "agenda 5.png", title: "Alexandre" },
      { file: "agenda 6.png", title: "Monique" },
      { file: "kit.png", title: "Kit Completo" },
      { file: "agenda 7.png", title: "Laurenice" },
    ],
  },
  cadernetas: {
    badge: "Caderneta",
    items: [
      { file: "cardeneta 1.png", title: "Allice" },
      { file: "cardeneta 2.png", title: "Isaac" },
      { file: "cardeneta 3.png", title: "Lily de Paula" },
      { file: "cardeneta 4.png", title: "José Leonardo" },
      { file: "cardeneta 5.png", title: "Jairon América" },
      { file: "cardeneta 6.png", title: "Asafe" },
    ],
  },
  biblias: {
    badge: "Bíblia",
    items: [
      { file: "biblia 1.png", title: "Eudes" },
      { file: "biblia 2.png", title: "Nayane" },
      { file: "biblia 3.png", title: "Valentina" },
      { file: "biblia 4.png", title: "Dinai Macedo" },
      { file: "biblia 5.png", title: "Luiza Xavier" },
      { file: "biblia 6.png", title: "Thayná Lima" },
    ],
  },
  chaveiros: {
    badge: "Personalizado",
    items: [
      { file: "chaveiro 3.png", title: "Val Soares", badge: "Chaveiro" },
      { file: "chaveiro 2.png", title: "Theo Garcia", badge: "Chaveiro" },
      { file: "chaveiro 4.png", title: "Dávilla Garcês", badge: "Chaveiro" },
      { file: "chaveiro 1.png", title: "Turma", badge: "Chaveiro" },
      { file: "button 4.png", title: "Em Família", badge: "Button" },
      { file: "button 3.png", title: "Emanuella", badge: "Button" },
      { file: "button 1.png", title: "Comunhão em Ação", badge: "Button" },
      { file: "button 2.png", title: "Saúde na Escola", badge: "Button" },
    ],
  },
};

function renderGrid(sectionId, gridId) {
  const data = products[sectionId];
  const grid = document.getElementById(gridId);
  if (!grid || !data) return;

  grid.innerHTML = data.items
    .map((item) => {
      const badge = item.badge || data.badge;
      const fullTitle = `${badge} — ${item.title}`;
      return `
        <div class="card">
          <div class="card-media" data-full="${img(item.file)}" data-title="${fullTitle}" data-category="${sectionId}">
            <span class="card-badge">${badge}</span>
            <img src="${img(item.file)}" alt="${fullTitle}" loading="lazy">
            <div class="card-caption">
              <h3>${item.title}</h3>
              <button type="button" class="card-order-btn" data-title="${fullTitle}" data-img="${img(item.file)}" data-category="${sectionId}" aria-label="Personalizar ${fullTitle}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              </button>
            </div>
          </div>
        </div>`;
    })
    .join("");
}

renderGrid("agendas", "grid-agendas");
renderGrid("cadernetas", "grid-cadernetas");
renderGrid("biblias", "grid-biblias");
renderGrid("chaveiros", "grid-chaveiros");

// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// Search (filtra produtos em destaque + catálogo completo pelo nome)
const searchToggle = document.getElementById("searchToggle");
const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");

searchToggle.addEventListener("click", () => {
  searchBar.classList.toggle("active");
  if (searchBar.classList.contains("active")) {
    searchInput.focus();
  } else {
    searchInput.value = "";
    filterProducts("");
  }
});

function filterProducts(query) {
  const q = query.trim().toLowerCase();
  document.querySelectorAll(".grid .card, .featured-grid .pcard, .price-grid .price-card").forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(q) ? "" : "none";
  });
}

searchInput.addEventListener("input", () => filterProducts(searchInput.value));

// Lightbox (zoom da imagem, com atalho para abrir o pedido)
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML = `
  <button class="lightbox-close" type="button" aria-label="Fechar">✕</button>
  <div class="lightbox-content">
    <img src="" alt="">
    <button class="btn btn-primary lightbox-order" type="button">Quero personalizar este →</button>
  </div>`;
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector("img");
const lightboxOrderBtn = lightbox.querySelector(".lightbox-order");

function openLightbox(fullSrc, title, category) {
  lightboxImg.src = fullSrc;
  lightboxImg.alt = title;
  lightboxOrderBtn.dataset.title = title;
  lightboxOrderBtn.dataset.img = fullSrc;
  lightboxOrderBtn.dataset.category = category || "";
  lightbox.classList.add("active");
}
function closeLightbox() {
  lightbox.classList.remove("active");
}

// Order modal (personalização antes de ir pro WhatsApp)
const orderModal = document.getElementById("orderModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const orderForm = document.getElementById("orderForm");
const fieldNome = document.getElementById("fieldNome");
const fieldDesc = document.getElementById("fieldDesc");
const fieldQtd = document.getElementById("fieldQtd");
const modalFormats = document.getElementById("modalFormats");
let currentProduct = null;

function openOrderModal(title, imgSrc, category) {
  currentProduct = { title, imgSrc };
  modalImg.src = imgSrc;
  modalImg.alt = title;
  modalTitle.textContent = title;
  orderForm.reset();
  fieldQtd.value = 1;
  modalFormats.hidden = category !== "agendas";
  orderModal.classList.add("active");
  closeLightbox();
  setTimeout(() => fieldNome.focus(), 100);
}
function closeOrderModal() {
  orderModal.classList.remove("active");
  currentProduct = null;
}

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentProduct) return;

  const nome = fieldNome.value.trim();
  const desc = fieldDesc.value.trim();
  const qtd = fieldQtd.value || "1";
  const formatoInput = orderForm.querySelector('input[name="formato"]:checked');
  const formato = !modalFormats.hidden && formatoInput ? formatoInput.value : null;

  const message = [
    "Olá! Vim pelo site da Grafick e quero fazer um pedido personalizado 😊",
    "",
    `Produto: ${currentProduct.title}`,
    ...(formato ? [`Formato: ${formato}`] : []),
    `Nome para personalização: ${nome}`,
    `Como eu quero: ${desc}`,
    `Quantidade: ${qtd}`,
  ].join("\n");

  window.open(waLink(message), "_blank", "noopener");
  closeOrderModal();
});

// Delegated clicks: order buttons, card media (zoom), closes
document.addEventListener("click", (e) => {
  // Order buttons are checked first because .card-order-btn now sits
  // inside .card-media (catalog caption overlay) — checking media first
  // would swallow the click and open the lightbox instead of the modal.
  const orderTrigger = e.target.closest(".card-link, .lightbox-order, .card-order-btn");
  if (orderTrigger) {
    openOrderModal(orderTrigger.dataset.title, orderTrigger.dataset.img, orderTrigger.dataset.category);
    return;
  }

  const media = e.target.closest(".card-media");
  if (media) {
    openLightbox(media.dataset.full, media.dataset.title, media.dataset.category);
    return;
  }

  if (e.target === lightbox || e.target.closest(".lightbox-close")) {
    closeLightbox();
    return;
  }

  if (e.target === orderModal || e.target.closest("#modalClose")) {
    closeOrderModal();
    return;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  closeLightbox();
  closeOrderModal();
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
