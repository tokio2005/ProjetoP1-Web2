import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./data-source";
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors());

// Incluir os controllers
import TestConnectionController from "./controllers/TestConnectionController";
import AuthController from "./controllers/AuthController";
import UsersController from "./controllers/UsersController";
import SituationsController from "./controllers/SituationsController";
import CategoriesController from "./controllers/CategoriesController";
import ProductSituationsController from "./controllers/ProductSituationsController";
import ProductsController from "./controllers/ProductsController";

app.use("/", TestConnectionController);
app.use("/", AuthController);
app.use("/", UsersController);
app.use("/", SituationsController);
app.use("/", CategoriesController);
app.use("/", ProductSituationsController);
app.use("/", ProductsController);

app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});