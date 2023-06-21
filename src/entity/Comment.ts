import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { Team } from "@/entity/Team";
import { IComment } from "@/@types";

@Entity()
class Comment implements IComment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  body: string;
  @Column()
  type: "problem" | "goal" | "solution";
  @ManyToOne(() => Team)
  @JoinColumn({ name: "teamId", referencedColumnName: "id" })
  team: Team;
}

export { Comment };
