import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tech } from "@/entity/Tech";
import { Team } from "@/entity/Team";
import { ITeamToTech } from "@/@types";

@Entity()
class TeamToTech implements ITeamToTech {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Team)
  @JoinColumn({ name: "teamId" })
  team: Team;
  @ManyToOne(() => Tech)
  @JoinColumn({ name: "techId" })
  tech: Tech;
}
export { TeamToTech };
