import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm"
import { Situation } from "./situations";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({unique:true})
    email!: string;

    @ManyToOne(() => Situation, (situation: Situation) => situation.users)
    @JoinColumn({name: "situationId"})
    situation!: Situation;

    @Column({type: "timestamp", default:()=> "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default:()=> "CURRENT_TIMESTAMP", onUpdate:"CURRENT_TIMESTAMP"})
    updatedAt!: Date; 
}