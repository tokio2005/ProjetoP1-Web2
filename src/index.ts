import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./data-source";

const app = express();

app.use(express.json());

// Incluir os controllers
import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";
import CategoriesController from "./controllers/CategoriesController";
import ProductSituationsController from "./controllers/ProductSituationsController";
import ProductsController from "./controllers/ProductsController";

app.use("/", AuthController);
app.use("/", SituationsController);
app.use("/", CategoriesController);
app.use("/", ProductSituationsController);
app.use("/", ProductsController);

app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});