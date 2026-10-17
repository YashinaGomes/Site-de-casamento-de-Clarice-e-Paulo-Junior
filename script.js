const WHATSAPP_NUMBER = "558588411170";

/* =========================
   MENU
========================= */

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");

  menuButton.setAttribute("aria-expanded", String(isOpen));

  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Fechar menu" : "Abrir menu"
  );
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

/* =========================
   ABRIR WHATSAPP
========================= */

function openWhatsApp(message) {
  const encodedMessage = encodeURIComponent(message);

  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );
}

/* =========================
   CAMPOS DOS CONVIDADOS
========================= */

const guestCount = document.querySelector("#guest-count");
const guestNamesContainer = document.querySelector("#guest-names");

/*
  Cria os campos de nomes de acordo
  com a quantidade selecionada.

  Exemplo:
  2 pessoas = 2 campos de nomes.
  5 pessoas = 5 campos de nomes.
*/

function createGuestNameFields() {
  const quantity = Number.parseInt(
    guestCount.value,
    10
  );

  /*
    Guarda os nomes que já foram digitados
    caso a quantidade seja alterada.
  */

  const previousNames = Array.from(
    document.querySelectorAll(".guest-name")
  ).map((input) => input.value);

  guestNamesContainer.innerHTML = "";

  if (!quantity || quantity < 1) {
    return;
  }

  for (let index = 1; index <= quantity; index++) {
    const label = document.createElement("label");

    const input = document.createElement("input");

    label.textContent = `Nome da pessoa ${index}`;

    input.type = "text";
    input.name = "guest-name";
    input.className = "guest-name";
    input.required = true;
    input.autocomplete = "name";
    input.placeholder = "Digite o nome completo";

    /*
      Mantém o nome já preenchido se
      a quantidade de pessoas for alterada.
    */

    input.value = previousNames[index - 1] || "";

    label.appendChild(input);
    guestNamesContainer.appendChild(label);
  }
}

guestCount.addEventListener(
  "change",
  createGuestNameFields
);

/*
  Cria os campos ao carregar a página,
  caso já exista uma quantidade selecionada.
*/

createGuestNameFields();

/* =========================
   CONFIRMAÇÃO DE PRESENÇA
========================= */

const rsvpForm = document.querySelector("#rsvp-form");

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const quantity = Number.parseInt(
    guestCount.value,
    10
  );

  const note = document
    .querySelector("#guest-message")
    .value
    .trim();

  if (!quantity) {
    alert(
      "Por favor, informe a quantidade de pessoas."
    );

    guestCount.focus();
    return;
  }

  const guestNameInputs = Array.from(
    document.querySelectorAll(".guest-name")
  );

  /*
    Verifica se todos os nomes foram preenchidos.
  */

  const emptyNameInput = guestNameInputs.find(
    (input) => !input.value.trim()
  );

  if (emptyNameInput) {
    alert(
      "Por favor, informe o nome de todas as pessoas."
    );

    emptyNameInput.focus();
    return;
  }

  const guestNames = guestNameInputs.map(
    (input) => input.value.trim()
  );

  /*
    Organiza os nomes em uma lista numerada
    para enviar ao WhatsApp.
  */

  const guestNamesList = guestNames
    .map((name, index) => `${index + 1}. ${name}`)
    .join("\n");

  const quantityText =
    quantity === 1
      ? "1 pessoa"
      : `${quantity} pessoas`;

  const message = [
    "Olá, Clarice! 💍",
    "",
    "Quero confirmar nossa presença no casamento de vocês.",
    "",
    `Quantidade de pessoas: ${quantityText}`,
    "",
    "Nomes confirmados:",
    guestNamesList,
    note ? `\nMensagem: ${note}` : ""
  ]
    .filter(Boolean)
    .join("\n");

  openWhatsApp(message);
});

/* =========================
   MODAL DOS PRESENTES
========================= */

const giftDialog = document.querySelector(
  "#gift-dialog"
);

const giftName = document.querySelector(
  "#gift-name"
);

const selectedGift = document.querySelector(
  "#selected-gift"
);

const giftForm = document.querySelector(
  "#gift-form"
);

const giverName = document.querySelector(
  "#giver-name"
);

const dialogClose = document.querySelector(
  ".dialog-close"
);

/*
  Abre o modal quando a pessoa clica
  no botão "Quero presentear".
*/

document
  .querySelectorAll(".choose-gift")
  .forEach((button) => {
    button.addEventListener("click", (event) => {
      /*
        Impede que o link abra o WhatsApp
        antes do preenchimento do nome.
      */

      event.preventDefault();

      const giftCard =
        button.closest(".gift-card");

      if (!giftCard) {
        return;
      }

      /*
        Pega exatamente o mesmo texto
        apresentado no título do presente.
      */

      const giftTitle =
        giftCard.querySelector("h3");

      const gift =
        giftTitle?.textContent.trim() ||
        giftCard.dataset.gift ||
        "Presente escolhido";

      selectedGift.value = gift;

      /*
        Funciona caso #gift-name seja
        um input ou apenas um elemento de texto.
      */

      if ("value" in giftName) {
        giftName.value = gift;
      } else {
        giftName.textContent = gift;
      }

      /*
        Limpa o nome preenchido anteriormente.
      */

      giverName.value = "";

      giftDialog.showModal();

      setTimeout(() => {
        giverName.focus();
      }, 100);
    });
  });

/* =========================
   FECHAR O MODAL
========================= */

dialogClose.addEventListener("click", () => {
  giftDialog.close();
});

giftDialog.addEventListener("click", (event) => {
  /*
    Fecha somente quando a pessoa clicar
    na área externa do modal.
  */

  if (event.target === giftDialog) {
    giftDialog.close();
  }
});

/* =========================
   CONFIRMAR PRESENTE
========================= */

giftForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const giver = giverName.value.trim();
  const gift = selectedGift.value.trim();

  if (!giver) {
    alert("Por favor, informe o seu nome.");

    giverName.focus();
    return;
  }

  if (!gift) {
    alert("Por favor, selecione um presente.");

    giftDialog.close();
    return;
  }

  /*
    O texto completo exibido no título
    do presente será enviado ao WhatsApp.
  */

  const message = [
    "Olá, Clarice!",
    "",
    `Eu sou ${giver}.`,
    `Presente escolhido: ${gift}.`,
    "",
    "Pode me confirmar se esse item ainda está disponível?"
  ].join("\n");

  openWhatsApp(message);

  giftDialog.close();
  giftForm.reset();
  selectedGift.value = "";
});

/* =========================
   CONTAGEM REGRESSIVA
========================= */

const weddingDate = new Date(
  "2026-11-07T19:00:00-03:00"
);

function updateCountdown() {
  const distance = Math.max(
    0,
    weddingDate.getTime() - Date.now()
  );

  const day = 1000 * 60 * 60 * 24;

  const days = Math.floor(
    distance / day
  );

  const hours = Math.floor(
    (distance % day) / 3600000
  );

  const minutes = Math.floor(
    (distance % 3600000) / 60000
  );

  const seconds = Math.floor(
    (distance % 60000) / 1000
  );

  document.querySelector("#days").textContent =
    days;

  document.querySelector("#hours").textContent =
    String(hours).padStart(2, "0");

  document.querySelector("#minutes").textContent =
    String(minutes).padStart(2, "0");

  document.querySelector("#seconds").textContent =
    String(seconds).padStart(2, "0");
}

updateCountdown();

setInterval(
  updateCountdown,
  1000
);

/* =========================
   ANIMAÇÕES AO ROLAR A PÁGINA
========================= */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

document
  .querySelectorAll(".reveal")
  .forEach((element) => {
    observer.observe(element);
  });