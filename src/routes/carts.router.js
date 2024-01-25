const express = require("express");
const router = express.Router();

var CARTS = [];

// Crea nuevo carrito
router.post("/", (req, res) => {
  const newCart = {
    id: generateCartId(),
    products: [],
  };

  CARTS.push(newCart);
  res.status(201).send({ status: 201, cart: newCart });
});

// Lista productos del carrito con el ID
router.get("/:cid", (req, res) => {
  const cartId = req.params.cid;
  const cart = CARTS.find((c) => c.id === cartId);

  if (cart) {
    res.status(200).send(cart.products);
  } else {
    res.status(404).send({ error: "Carrito no encontrado" });
  }
});

// Agregar un producto al carrito con el ID
router.post("/:cid/product/:pid", (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  const cartIndex = CARTS.findIndex((c) => c.id === cartId);

  if (cartIndex !== -1) {
    const cart = CARTS[cartIndex];
    const existingProduct = cart.products.find((p) => p.product === productId);

    if (existingProduct) {
      // Si el producto ya existe en el carrito, incrementar la cantidad
      existingProduct.quantity += quantity;
    } else {
      // Si el producto no existe, agregarlo al carrito
      cart.products.push({ product: productId, quantity });
    }

    res.status(201).send({ status: 201, cart: cart });
  } else {
    res.status(404).send({ error: "Carrito no encontrado" });
  }
});

// Función para generar un ID único para cada carrito
function generateCartId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = router;
