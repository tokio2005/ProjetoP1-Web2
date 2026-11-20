import { DataSource } from "typeorm";
import { User } from "../entity/users";
import { Situation } from "../entity/situations";
import bcrypt from "bcryptjs";

export default class CreateUsersSeeds {
    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando o seed para a tabela 'users'...");

        const userRepository = dataSource.getRepository(User);
        const situationRepository = dataSource.getRepository(Situation);

        const existingCount = await userRepository.count();
        if (existingCount > 0) {
            console.log("A tabela 'users' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }

        const situation = await situationRepository.findOne({ where: { id: 1 } });
        if (!situation) {
            throw new Error(
                "Nenhuma situação encontrada com o ID 1. Rode o seed de 'situations' antes do de 'users'."
            );
        }

        await userRepository.save([
            { id: 1, name: "Adriano Baião", email: "baiao@baiao.com.br",password: await bcrypt.hash ("123456", 10), situation },
            { id: 2, name: "Aurora", email: "aurora@baiao.com.br",password: await bcrypt.hash ("123456", 10), situation },
        ]);

        console.log("Seed concluído com sucesso: usuários cadastrados!");
    }
}