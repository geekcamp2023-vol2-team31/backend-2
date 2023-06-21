import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tech } from "@/entity/Tech";
import { Team } from "@/entity/Team";

@Entity()
class TeamToTech {
  //implements IPageToTech
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Team)
  @JoinColumn({ name: "teamId" })
  page: Team;
  @ManyToOne(() => Tech)
  @JoinColumn({ name: "techId" })
  tech: Tech;
}
export { TeamToTech };
