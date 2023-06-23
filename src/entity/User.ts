import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  JoinTable,
} from "typeorm";
import { Team } from "@/entity/Team";
import { UserToTech } from "@/entity/UserToTech";
import { IUser } from "@/@types/entity";

@Entity()
class User implements IUser {
  @PrimaryColumn()
  id: string;
  @Column()
  bio: string;
  @Column({ nullable: true })
  icon?: string;
  @Column()
  name: string;
  @Column()
  githubId: number;
  @ManyToMany(() => Team, (team) => team.members)
  @JoinTable()
  teamsBelongs: Team[];
  @OneToMany(() => Team, (team) => team.owner)
  @JoinTable()
  teamsOwns: Team[];
  @OneToMany(() => UserToTech, (userToTech) => userToTech.user)
  userToTechs: UserToTech[];
}
export { User };
