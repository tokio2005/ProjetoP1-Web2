import express, { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { AppDataSource } from "../data-source";
import { User } from "../entity/users";
import * as yup from "yup";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

const Router = express.Router();

// ---------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------
Router.post("/", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "Email e senha são obrigatórios!",
            });
            return;
        }

        const authService = new AuthService();
        const userData = await authService.login(email, password);

        res.status(200).json({
            message: "Login realizado com sucesso!",
            user: userData,
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: "Erro ao realizar o login!",
        });
        return;
    }
});

// ---------------------------------------------------------------
// SOLICITAR RECUPERAÇÃO DE SENHA
// Body: { "urlRecoverPassword": "http://localhost:3000/recuperar-senha", "email": "..." }
// ---------------------------------------------------------------
Router.post("/recover-password", async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const schema = yup.object().shape({
            urlRecoverPassword: yup.string().required("A URL é obrigatória"),
            email: yup
                .string()
                .email("E-mail inválido!")
                .required("O campo e-mail é obrigatório!"),
        });

        await schema.validate(data, { abortEarly: false });

        const userRepository = AppDataSource.getRepository(User);
        

        const user = await userRepository.findOneBy({ email: data.email });

        if (!user) {
            res.status(404).json({
                message: "Usuário não encontrado!",
            });
            return;
        }

        // Gerar a chave de recuperação e salvar no usuário
        user.recoverPassword = crypto.randomBytes(32).toString("hex");
        await userRepository.save(user);
        console.log("CHAVE GERADA:", user.recoverPassword)

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const link = `${data.urlRecoverPassword}?email=${encodeURIComponent(
            data.email
        )}&key=${user.recoverPassword}`;

        const message_content = {
            from: process.env.EMAIL_FROM,
            to: data.email,
            subject: "Recuperar Senha",
            text: `Prezado(a) ${user.name}\n\n
Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.\n\n
Clique ou copie o link para criar uma nova senha em nosso sistema:
${link}\n\n
Esta mensagem foi enviada a você pela empresa ${process.env.APP}.\n
Você está recebendo este e-mail porque está cadastrado no banco de dados da empresa ${process.env.APP}.
Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita
o preenchimento de senhas e informações cadastrais.\n\n`,
            html: `Prezado(a) ${user.name}<br><br>
Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.<br><br>
Clique no link para criar uma nova senha em nosso sistema:<br>
<a href="${link}">${link}</a><br><br>
Esta mensagem foi enviada a você pela empresa ${process.env.APP}.<br><br>
Você está recebendo este e-mail porque está cadastrado no banco de dados da empresa ${process.env.APP}.<br>
Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita o preenchimento de senhas e informações cadastrais.<br><br>`,
        };

        // Aguarda o envio e responde apenas UMA vez
        try {
            await transporter.sendMail(message_content);

            res.status(200).json({
                message: "E-mail enviado! Verifique sua caixa de entrada!",
            });
            return;
        } catch (err) {
            console.log("Erro ao enviar e-mail:", err);

            res.status(500).json({
                message: `E-mail não enviado, tente novamente ou contate ${process.env.EMAIL_ADM}`,
            });
            return;
        }
    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors,
            });
            return;
        }

        console.log(error);
        res.status(500).json({
            message: "Erro ao solicitar a recuperação de senha!",
        });
        return;
    }
});

// ---------------------------------------------------------------
// VALIDAR A CHAVE DE RECUPERAÇÃO
// Body: { "email": "...", "recoverPassword": "chave" }
// ---------------------------------------------------------------
Router.post("/validate-recover-password", async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const schema = yup.object().shape({
            recoverPassword: yup.string().required("A chave é obrigatória"),
            email: yup
                .string()
                .email("E-mail inválido!")
                .required("O campo e-mail é obrigatório!"),
        });

        await schema.validate(data, { abortEarly: false });

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({
            email: data.email,
            recoverPassword: data.recoverPassword,
        });

        if (!user) {
            res.status(404).json({
                message: "A chave de recuperar senha é inválida!",
            });
            return;
        }

        res.status(200).json({
            message: "A chave de recuperar senha é válida!",
        });
        return;
    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors,
            });
            return;
        }

        console.log(error);
        res.status(500).json({
            message: "Erro ao validar a chave de recuperar senha!",
        });
        return;
    }
});

// ---------------------------------------------------------------
// ATUALIZAR A SENHA
// Body: { "email": "...", "recoverPassword": "chave", "password": "novaSenha" }
// ---------------------------------------------------------------
Router.put("/update-password", async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const schema = yup.object().shape({
            recoverPassword: yup.string().required("A chave é obrigatória"),
            email: yup
                .string()
                .email("E-mail inválido!")
                .required("O campo e-mail é obrigatório!"),
            password: yup
                .string()
                .required("O campo senha é obrigatório!")
                .min(6, "A senha deve ter no mínimo 6 caracteres"),
        });

        await schema.validate(data, { abortEarly: false });
        console.log("RECEBIDO:", data.email, data.recoverPassword);

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({
            email: data.email,
            recoverPassword: data.recoverPassword,
        });

        if (!user) {
            res.status(404).json({
                message: "A chave de recuperar senha é inválida!",
            });
            return;
        }

        // Invalida a chave para que não possa ser reutilizada
        data.recoverPassword = null;

        // Criptografa a nova senha
        data.password = await bcrypt.hash(data.password, 8);

        // Atualizar os dados do usuário
        userRepository.merge(user, data);

        // Salvar as alterações
        await userRepository.save(user);

        res.status(200).json({
            message: "Senha atualizada com sucesso!",
        });
        return;
    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors,
            });
            return;
        }

        console.log(error);
        res.status(500).json({
            message: "Erro ao atualizar a senha!",
        });
        return;
    }
});

export default Router;