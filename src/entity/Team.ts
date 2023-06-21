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

@Entity()
class Team {
  //implements ITeam
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
}
export { Team };
