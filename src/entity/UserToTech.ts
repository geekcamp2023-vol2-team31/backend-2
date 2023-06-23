import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { User } from "@/entity/User";
import { Tech } from "@/entity/Tech";
import { IUserToTech } from "@/@types/entity";

@Entity()
class UserToTech implements IUserToTech {
  //
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;
  @ManyToOne(() => Tech)
  @JoinColumn({ name: "techId" })
  tech: Tech;
  @Column()
  level: "beginner" | "advanced" | "expert";
}
export { UserToTech };
