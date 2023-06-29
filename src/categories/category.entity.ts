import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
