import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { ILink } from "@/@types/entity/ILink";
import { Comment } from "@/entity/Comment";
import { Team } from "@/entity/Team";

@Entity()
class Link implements ILink {
  @PrimaryColumn()
  id: string;
  @ManyToOne(() => Team)
  team: Team;
  @ManyToOne(() => Comment)
  left: Comment;
  @ManyToOne(() => Comment)
  right: Comment;
}

export { Link };
