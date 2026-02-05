import { supabase } from "./supabase/supabaseClient.js";

// 1) Paste Item4Gamer "check username" API here later:
const CHECK_USERNAME_URL = ""; // e.g. "https://api.example.com/check-mlbb-user"

// Example product list (edit later)
let PRODUCTS = [];


const elUserId = document.getElementById("mlbbUserId");
const elServerId = document.getElementById("mlbbServerId");
const btnCheckName = document.getElementById("btnCheckName");
const nameStatus = document.getElementById("nameStatus");
const playerNameBox = document.getElementById("playerNameBox");
const playerNameValue = document.getElementById("playerNameValue");

const productsScroll = document.getElementById("productsScroll");
const totalPriceEl = document.getElementById("totalPrice");
const btnNext = document.getElementById("btnNext");

const agreeTerms = document.getElementById("agreeTerms");
const btnPay = document.getElementById("btnPay");
const payStatus = document.getElementById("payStatus");

let verifiedName = false;
let selectedProduct = null;

// Render products
async function renderProducts() {
  productsScroll.innerHTML = "Loading packages...";

  const { data, error } = await supabase
    .from("topup_products")
    .select("id, title, price, img_url")
    .eq("game", "mlbb")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    productsScroll.innerHTML = "Failed to load products.";
    return;
  }

  PRODUCTS = data || [];

  productsScroll.innerHTML = PRODUCTS.map(p => `
    <button class="topup-product" data-id="${p.id}" type="button">
      <div class="topup-product-left">
        <img
          class="topup-product-img"
          src="${p.img_url || './images/placeholder.png'}"
          alt="${escapeHtml(p.title)}"
        />
        <div class="topup-product-title">${escapeHtml(p.title)}</div>
      </div>
      <div class="topup-product-price">$${Number(p.price).toFixed(2)}</div>
    </button>
  `).join("");

  productsScroll.querySelectorAll(".topup-product").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      selectedProduct = PRODUCTS.find(x => x.id === id) || null;

      productsScroll
        .querySelectorAll(".topup-product")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      updateTotal();
      updateButtons();
    });
  });
}

function updateTotal() {
  const total = selectedProduct ? Number(selectedProduct.price) : 0;
  totalPriceEl.textContent = `$${total.toFixed(2)}`;
}


function updateButtons() {
  // "Next" requires name verified + product chosen
  btnNext.disabled = !(verifiedName && selectedProduct);

  // "Pay" requires Next-ready + terms checked
  btnPay.disabled = !(verifiedName && selectedProduct && agreeTerms.checked);
}

function setStatus(el, text, type) {
  el.textContent = text || "";
  el.classList.remove("ok", "warn", "err");
  if (type) el.classList.add(type);
}

// Username verification
btnCheckName.addEventListener("click", async () => {
  const user_id = (elUserId.value || "").trim();
  const server_id = (elServerId.value || "").trim();

  playerNameBox.style.display = "none";
  playerNameValue.textContent = "";
  verifiedName = false;
  updateButtons();

  if (!user_id || !server_id) {
    setStatus(nameStatus, "Please enter User ID and Server ID.", "warn");
    return;
  }

  setStatus(nameStatus, "Checking username…", "warn");

  try {
    // If no API yet, mock it so UI works
    if (!CHECK_USERNAME_URL) {
      await sleep(600);
      const mockName = `Player_${user_id.slice(-4)}`;
      verifiedName = true;
      setStatus(nameStatus, "Username found.", "ok");
      playerNameValue.textContent = mockName;
      playerNameBox.style.display = "block";
      updateButtons();
      return;
    }

    // Real API call (you will adjust payload/fields when you get the spec)
    const res = await fetch(CHECK_USERNAME_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, server_id })
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    // expected: { ok: true, username: "..." }  (adjust later if needed)
    if (!data || !data.username) {
      setStatus(nameStatus, "Username not found. Please re-check ID/Server.", "err");
      verifiedName = false;
      updateButtons();
      return;
    }

    verifiedName = true;
    setStatus(nameStatus, "Username found.", "ok");
    playerNameValue.textContent = data.username;
    playerNameBox.style.display = "block";
    updateButtons();
  } catch (e) {
    setStatus(nameStatus, "Failed to check username. Try again.", "err");
    verifiedName = false;
    updateButtons();
  }
});

// Next button (locks in selection; you can later open a payment modal)
btnNext.addEventListener("click", () => {
  if (!(verifiedName && selectedProduct)) return;
  setStatus(payStatus, "Ready for payment. Tick Terms, then click Pay.", "ok");
});

// Terms gating
agreeTerms.addEventListener("change", () => {
  updateButtons();
});

// Pay button (placeholder: next step we will connect to real payment/order flow)
btnPay.addEventListener("click", () => {
  if (btnPay.disabled) return;

  // Here you will later:
  // - create an order in Supabase (pending_payment)
  // - show KHQR/ABA instructions / QR
  setStatus(payStatus, "Proceeding to payment (placeholder). Next step: integrate ABA/KHQR flow.", "ok");
});

// Helpers
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Init
renderProducts();
updateTotal();
updateButtons();
