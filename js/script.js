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
      { file: "agenda 9.jpeg", title: "Agenda Monique", desc: "Capa floral aquarelada com detalhes dourados e nome em destaque." },
      { file: "agenda 8.jpeg", title: "Agenda Alexandre", desc: "Estampa moderna holográfica com detalhe em laranja." },
      { file: "agenda 7.jpeg", title: "Agenda Fran", desc: "Efeito mármore colorido com assinatura personalizada." },
      { file: "agenda 5.jpeg", title: "Agenda Heloise", desc: "Capa elegante em tons vinho e dourado, com inicial do nome." },
      { file: "agenda 3.jpeg", title: "Agenda Brenda", desc: "Arte floral delicada em azul e rosa, nome em destaque." },
      { file: "agenda 2.jpeg", title: "Agenda Profissional", desc: "Capa personalizada para profissionais, com nome e área de atuação." },
      { file: "agenda 4.jpeg", title: "Agenda de Viagens", desc: "Agenda temática personalizada para empresas e uso pessoal." },
      { file: "agenda 6.jpeg", title: "Kit Bíblia + Caderno de Oração", desc: "Conjunto personalizado floral com nome bordado na capa." },
      { file: "agenda 1.jpeg", title: "Agenda Corporativa", desc: "Impressão personalizada de capas para empresas e eventos." },
    ],
  },
  cadernetas: {
    badge: "Caderneta",
    items: [
      { file: "Caderneta 1.jpeg", title: "Caderneta de Saúde — Bebê", desc: "Registro do bebê personalizado com foto, nome e dados de nascimento." },
      { file: "Carderneta 3.jpeg", title: "Caderneta de Saúde — Recém-nascido", desc: "Capa com foto do bebê, nome e dados de nascimento em destaque." },
      { file: "Carderneta 2.jpeg", title: "Caderneta de Saúde", desc: "Capa floral personalizada com o nome e chaveirinho combinando." },
      { file: "Carderneta 4.jpeg", title: "Caderneta de Saúde Infantil", desc: "Tema infantil personalizado com nome e ilustração exclusiva." },
      { file: "Carderneta 5.jpeg", title: "Caderneta de Gestante", desc: "Capa delicada para acompanhar cada etapa da gestação, com nome da mamãe." },
    ],
  },
  biblias: {
    badge: "Bíblia",
    items: [
      { file: "Biblia 3.jpeg", title: "Bíblia Sagrada Personalizada", desc: "Capa rosa floral com ilustração exclusiva e nome em destaque." },
      { file: "Biblia 2.jpeg", title: "Bíblia Sagrada Personalizada", desc: "Capa delicada com fecho decorativo \"Fé\" e fita marcadora." },
      { file: "Biblia 4.jpeg", title: "Bíblia Sagrada Personalizada", desc: "Capa floral clássica com nome em caligrafia e cantoneiras douradas." },
      { file: "Biblia 1.jpeg", title: "Bíblia Sagrada Personalizada", desc: "Arte exclusiva com acabamento premium e nome do dono(a)." },
    ],
  },
};

function renderGrid(sectionId, gridId) {
  const data = products[sectionId];
  const grid = document.getElementById(gridId);
  if (!grid || !data) return;

  grid.innerHTML = data.items
    .map(
      (item) => `
        <div class="card">
          <div class="card-media" data-full="${img(item.file)}" data-title="${item.title}">
            <span class="card-badge">${data.badge}</span>
            <img src="${img(item.file)}" alt="${item.title}" loading="lazy">
          </div>
          <div class="card-body">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <button type="button" class="card-link" data-title="${item.title}" data-img="${img(item.file)}">Quero personalizar →</button>
          </div>
        </div>`
    )
    .join("");
}

renderGrid("agendas", "grid-agendas");
renderGrid("cadernetas", "grid-cadernetas");
renderGrid("biblias", "grid-biblias");

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

function openLightbox(fullSrc, title) {
  lightboxImg.src = fullSrc;
  lightboxImg.alt = title;
  lightboxOrderBtn.dataset.title = title;
  lightboxOrderBtn.dataset.img = fullSrc;
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
let currentProduct = null;

function openOrderModal(title, imgSrc) {
  currentProduct = { title, imgSrc };
  modalImg.src = imgSrc;
  modalImg.alt = title;
  modalTitle.textContent = title;
  orderForm.reset();
  fieldQtd.value = 1;
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

  const message = [
    "Olá! Vim pelo site da Grafick e quero fazer um pedido personalizado 😊",
    "",
    `Produto: ${currentProduct.title}`,
    `Nome para personalização: ${nome}`,
    `Como eu quero: ${desc}`,
    `Quantidade: ${qtd}`,
  ].join("\n");

  window.open(waLink(message), "_blank", "noopener");
  closeOrderModal();
});

// Delegated clicks: card media (zoom), order buttons, closes
document.addEventListener("click", (e) => {
  const media = e.target.closest(".card-media");
  if (media) {
    openLightbox(media.dataset.full, media.dataset.title);
    return;
  }

  const orderTrigger = e.target.closest(".card-link, .lightbox-order");
  if (orderTrigger) {
    openOrderModal(orderTrigger.dataset.title, orderTrigger.dataset.img);
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
