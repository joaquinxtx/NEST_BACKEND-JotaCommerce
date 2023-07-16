import { Product } from 'src/products/product.entity';
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column()
  description: string;
  @Column()
  image: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_add: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  update_add: Date;

 
  @OneToMany(()=> Product, product => product.id)
  prodct:Product
}
