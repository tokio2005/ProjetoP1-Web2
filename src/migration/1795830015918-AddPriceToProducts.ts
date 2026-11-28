import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPriceToProducts1796000000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "products",
            new TableColumn({
                name: "price",
                type: "decimal",
                precision: 10,
                scale: 2,
                default: 0,
                isNullable: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("products", "price");
    }
}