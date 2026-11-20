import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm"
import { Situation } from "./situations";
import bcrypt from "bcryptjs";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({unique:true})
    email!: string;

     @Column()
    password!: string;

   @Column({ type: "varchar", nullable: true, unique: true })
    recoverPassword!: string | null;

    @ManyToOne(() => Situation, (situation: Situation) => situation.users)
    @JoinColumn({name: "situationId"})
    situation!: Situation;

    @Column({type: "timestamp", default:()=> "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", default:()=> "CURRENT_TIMESTAMP", onUpdate:"CURRENT_TIMESTAMP"})
    updatedAt!: Date; 
;
   @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && !this.password.startsWith("$2")) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async comparePassword(password: string): Promise<boolean>{
        return bcrypt.compare(password, this.password)
    }
}