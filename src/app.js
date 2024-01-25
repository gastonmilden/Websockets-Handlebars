import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import exphbs from "express-handlebars";
import routerProducts from "./routes/products.router.js";
import __dirname from "./utils.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de Handlebars
app.engine("handlebars", exphbs.engine);
app.set("view engine", "handlebars");

// Configuración de middleware y rutas
app.use(express.json());
app.use(express.static("public"));

// Routers
app.use("/products", routerProducts);

// Rutas para renderizar vistas
app.get("/", (req, res) => {
  // Lógica para obtener todos los productos
  const products = obtenerTodosLosProductos(); // Implementa esta función según tu lógica
  res.render(path.join(__dirname, "views", "layouts", "home"), { products });
});

app.get("/realtimeproducts", (req, res) => {
  // Lógica para obtener todos los productos
  const products = obtenerTodosLosProductos(); // Implementa esta función según tu lógica
  res.render(path.join(__dirname, "views", "layouts", "realTimeProducts"), {
    products,
  });
});

// Escuchar eventos de conexión de Socket.IO
io.on("connection", (socket) => {
  console.log("Usuario conectado");

  // Manejar evento para agregar un nuevo producto
  socket.on("addProduct", (newProduct) => {
    // Lógica para agregar un nuevo producto
    // Emitir evento para informar sobre la creación de un nuevo producto
    io.emit("updateProducts", obtenerTodosLosProductos());
  });
});

// Inicio del servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Función de ejemplo para obtener todos los productos (debes implementarla según tu lógica)
function obtenerTodosLosProductos() {
  // Implementa la lógica para obtener todos los productos
  return [
    { title: "Producto 1", description: "Descripción del Producto 1" },
    { title: "Producto 2", description: "Descripción del Producto 2" },
    // ... (más productos)
  ];
}


export { io };