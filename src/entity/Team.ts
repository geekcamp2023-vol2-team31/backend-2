import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "@/entity/User";
import { Comment } from "@/entity/Comment";
import { Product } from "@/entity/Product";
import { ITeam } from "@/@types/entity";
import { TeamToTech } from "@/entity/TeamToTech";

@Entity()
class Team implements ITeam {
  @PrimaryColumn()
  id: string;
  @Column({ nullable: true })
  invitationCode?: string;
  @ManyToMany(() => User, (user) => user.teamsBelongs)
  members: User[];
  @Column()
  name: string;
  @OneToOne(() => User)
  owner: User;
  @OneToMany(() => Comment, (comment) => comment.team)
  comments: Comment[];
  @OneToMany(() => Product, (products) => products.team)
  products: Product[];
  @OneToMany(() => TeamToTech, (teamToTech) => teamToTech.team)
  techsUses: TeamToTech[];
}
export { Team };
