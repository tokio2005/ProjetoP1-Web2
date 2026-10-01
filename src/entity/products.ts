import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "./categories";
import { ProductSituation } from "./productSituations";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255 })
    name!: string;

    @Column()
    productSituationId!: number;

    @Column()
    productCategoryId!: number;

    @ManyToOne(() => ProductSituation, (situation: ProductSituation) => situation.products, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
    @JoinColumn({ name: "productSituationId" })
    situation!: ProductSituation;

    @ManyToOne(() => Category, (category: Category) => category.products, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
    @JoinColumn({ name: "productCategoryId" })
    category!: Category;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date;
}