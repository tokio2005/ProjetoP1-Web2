import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRecoverPasswordToUsers1795134271039 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.addColumn('users', new TableColumn({
                    name: "recoverPassword",
                    type:  "varchar",
                    isUnique: true,
                    isNullable: false,
                }))
        
                await queryRunner.query('ALTER TABLE users MODIFY COLUMN recoverPassword varchar(255) AFTER email')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.dropColumn("users", "recoverPassword")
    }

}
