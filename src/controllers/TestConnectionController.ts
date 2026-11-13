
import express, {Request, Response} from "express";

const Router = express.Router();

Router.get("/test-connection",(req:Request, res:Response)=>{
     res.status(200).json({mensage:"Conexão com a API realizada com sucesso!"});
     
})
export default Router
