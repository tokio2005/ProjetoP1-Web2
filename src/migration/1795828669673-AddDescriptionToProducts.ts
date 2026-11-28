import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDescriptionToProducts1795900000000 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "products",
            new TableColumn({
                name: "description",
                type: "text",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("products", "description");
    }
}