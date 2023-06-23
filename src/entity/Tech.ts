import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { UserToTech } from "@/entity/UserToTech";
import { ITech } from "@/@types/entity";

@Entity()
class Tech implements ITech {
  @PrimaryColumn()
  name: string;
  @Column({ nullable: true })
  icon?: string;
  @OneToMany(() => UserToTech, (userToTech) => userToTech.tech)
  userToTechs: UserToTech[];
  @OneToMany(() => UserToTech, (userToTech) => userToTech.tech)
  productToTechs: UserToTech[];
}
export { Tech };
