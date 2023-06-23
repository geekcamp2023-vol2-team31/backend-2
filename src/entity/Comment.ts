import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { Team } from "@/entity/Team";
import { IComment, ICommentType } from "@/@types/entity";

@Entity()
class Comment implements IComment {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  body: string;
  @Column()
  type: ICommentType;
  @ManyToOne(() => Team)
  @JoinColumn({ name: "teamId", referencedColumnName: "id" })
  team: Team;
}

export { Comment };
