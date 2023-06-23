import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Comment } from "@/entity/Comment";
import { Team } from "@/entity/Team";
import { IProduct } from "@/@types/entity";
import { Tech } from "@/entity/Tech";

@Entity()
class Product implements IProduct {
  //
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @OneToMany(() => Comment, (comment) => comment.team)
  comments: Comment[];
  techs: Tech[];
  team: Team;
}
export { Product };
