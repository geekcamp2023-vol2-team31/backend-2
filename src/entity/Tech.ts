import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { UserToTech } from "@/entity/UserToTech";
import { TeamToTech } from "@/entity/TeamToTech";

@Entity()
class Tech {
  //implements ITech
  @PrimaryColumn()
  name: string;
  @Column({ nullable: true })
  icon?: string;
  @OneToMany(() => TeamToTech, (teamToTech) => teamToTech.tech)
  teamsUsed: TeamToTech[];
  @OneToMany(() => UserToTech, (userToTech) => userToTech.tech)
  userToTechs: UserToTech[];
}
export { Tech };
