import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { User } from "@/entity/User";
import { Tech } from "@/entity/Tech";
import { Product } from "@/entity/Product";

@Entity()
class ProductToTech {
  //
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User)
  @JoinColumn({ name: "productId" })
  product: Product;
  @ManyToOne(() => Tech)
  @JoinColumn({ name: "techId" })
  tech: Tech;
}
export { ProductToTech };
