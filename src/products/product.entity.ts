import { Category } from "src/categories/category.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : "products"})
export class Product{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string

    @Column()
    description:string
    @Column()
    id_category:number

    @Column({nullable:true})
    image1:string

    @Column({nullable:true})
    image2:string

    @Column()
    price:number

    @Column({type:'datetime',default:()=>"CURRENT_TIMESTAMP"})
    created_add:Date

    @Column({type:'datetime',default:()=>"CURRENT_TIMESTAMP"})
    update_add:Date

    @ManyToOne(()=> Category,(category)=> category.id)
    @JoinColumn({name:"id_category"})
    category:Category

}