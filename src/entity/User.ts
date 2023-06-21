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

@Entity()
class User {
  // implements IUser
  @PrimaryColumn()
  id: string;
  @Column()
  bio: string;
  @Column({ nullable: true })
  icon?: string;
  @Column()
  name: string;
  @Column()
  email: string;
  @ManyToMany(() => Team, (team) => team.members)
  @JoinTable()
  teamsBelongs: Team[];
  @OneToMany(() => Team, (team) => team.owner)
  teamsOwns: Team[];
  @OneToMany(() => UserToTech, (userToTech) => userToTech.user)
  userToTechs: UserToTech[];
}
export { User };
