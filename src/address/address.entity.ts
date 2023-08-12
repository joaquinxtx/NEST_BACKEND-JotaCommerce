import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"address"})
export class Address{
@PrimaryGeneratedColumn()
id:number

@Column()
address:string

@Column()
neighborhood:string


@Column({type:'datetime',default:()=>"CURRENT_TIMESTAMP"})
created_add:Date

@Column({type:'datetime',default:()=>"CURRENT_TIMESTAMP"})
update_add:Date

@ManyToOne(()=> User, (user)=> user.id)
@JoinColumn({name:"id_user"})
user:User



}
