import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { UserToTech } from "@/entity/UserToTech";
import { TeamToTech } from "@/entity/TeamToTech";
import { ITech } from "@/@types/entity";

@Entity()
class Tech implements ITech {
  @PrimaryColumn()
  name: string;
  @Column({ nullable: true })
  icon?: string;
  @OneToMany(() => TeamToTech, (teamToTech) => teamToTech.tech)
  teamsUsed: TeamToTech[];
  @OneToMany(() => UserToTech, (userToTech) => userToTech.tech)
  userToTechs: UserToTech[];
  @OneToMany(() => UserToTech, (userToTech) => userToTech.tech)
  productToTechs: UserToTech[];
}
export { Tech };
