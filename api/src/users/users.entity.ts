import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";

@Entity()
export class users {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({unique: true})
    name: string
}