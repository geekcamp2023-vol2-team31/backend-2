import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { User } from "@/entity/User";
import { Comment } from "@/entity/Comment";
import { Product } from "@/entity/Product";
import { ITeam } from "@/@types/entity";

@Entity()
class Team implements ITeam {
  @PrimaryColumn()
  id: string;
  @Column({ nullable: true })
  invitationCode?: string;
  @ManyToMany(() => User, (user) => user.teamsBelongs, { eager: true })
  members: User[];
  @Column()
  name: string;
  @ManyToOne(() => User, { eager: true })
  owner: User;
  @OneToMany(() => Comment, (comment) => comment.team)
  comments: Comment[];
  @OneToMany(() => Product, (products) => products.team)
  products: Product[];
}
export { Team };
