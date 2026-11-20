import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSlugToProducts1790821051083 implements MigrationInterface {
    name = "AddSlugToProducts1790821051083";
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Adiciona a coluna permitindo nulo (os produtos atuais ainda não têm slug)
        await queryRunner.addColumn("products", new TableColumn({
            name: "slug",
            type: "varchar",
            length: "255",
            isNullable: true,
        }));

        // 2. Preenche os produtos existentes com um slug único (nome + id)
        await queryRunner.query(
            `UPDATE products SET slug = CONCAT(LOWER(REPLACE(name, ' ', '-')), '-', id) WHERE slug IS NULL`
        );

        // 3. Torna obrigatória e posiciona logo depois de "name" (como no vídeo)
        await queryRunner.query(
            `ALTER TABLE products MODIFY COLUMN slug varchar(255) NOT NULL AFTER name`
        );

        // 4. Torna única
        await queryRunner.query(
            `ALTER TABLE products ADD CONSTRAINT UQ_products_slug UNIQUE (slug)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE products DROP INDEX UQ_products_slug`);
        await queryRunner.dropColumn("products", "slug");
    }
}