import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Comment } from "@/entity/Comment";
import { Team } from "@/entity/Team";
import { IProduct } from "@/@types/entity";
import { ProductToTech } from "@/entity/ProductToTech";

@Entity()
class Product implements IProduct {
  //
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @OneToMany(() => Comment, (comment) => comment.team)
  comments: Comment[];
  @OneToMany(() => ProductToTech, (productToTech) => productToTech.product)
  productToTech: ProductToTech[];
  @ManyToOne(() => Team)
  @JoinColumn()
  team: Team;
}
export { Product };
