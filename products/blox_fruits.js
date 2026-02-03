// products/blox_fruits.js
// This file must be loaded BEFORE script.js
// Do NOT use type="module" for this file

window.bloxFruitsProducts = [
  {
    P_ID: 1,
    P_name: "Gomu Gomu no Mi",
    game: "Blox Fruits",
    tradeValue: 1000,
    image: "./products/images/products/blox-fruits/gomu-gomu.png"
  },
  {
    P_ID: 2,
    P_name: "Dragon Fruit",
    game: "Blox Fruits",
    tradeValue: 1500,
    image: "./images/logo.jpg"
  },
  {
    P_ID: 3,
    P_name: "Light Fruit",
    game: "Blox Fruits",
    tradeValue: 1200,
    image: "./images/products/blox-fruits/light.png"
  },
  {
    P_ID: 4,
    P_name: "Shadow Fruit",
    game: "Blox Fruits",
    tradeValue: 1800,
    image: "./images/products/blox-fruits/shadow.png"
  },
  {
    P_ID: 5,
    P_name: "Dough Fruit",
    game: "Blox Fruits",
    tradeValue: 2000,
    image: "./images/products/blox-fruits/dough.png"
  },
  {
    P_ID: 6,
    P_name: "Leopard Fruit",
    game: "Blox Fruits",
    tradeValue: 2500,
    image: "./images/products/blox-fruits/leopard.png"
  }
];

// Debug check (safe)
console.log("✅ Blox Fruits products loaded:", window.bloxFruitsProducts.length);
