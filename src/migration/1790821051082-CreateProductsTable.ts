import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductsTable1790821051082 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
        new Table({
            name: "products",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "name", type: "varchar", length: "255", isNullable: false },
                { name: "productSituationId", type: "int", isNullable: false },
                { name: "productCategoryId", type: "int", isNullable: false },
                { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" },
            ],
            foreignKeys: [
                {
                    columnNames: ["productSituationId"],
                    referencedTableName: "product_situations",
                    referencedColumnNames: ["id"],
                    onDelete: "RESTRICT",
                    onUpdate: "CASCADE",
                },
                {
                    columnNames: ["productCategoryId"],
                    referencedTableName: "product_categories",
                    referencedColumnNames: ["id"],
                    onDelete: "RESTRICT",
                    onUpdate: "CASCADE",
                },
            ],
        })
    );
}

public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("products");
}

}
