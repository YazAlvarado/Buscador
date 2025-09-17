import express from "express";
import cors from "cors";
import busquedaRouter from "./rutas/busqueda.js";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/busqueda", busquedaRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
