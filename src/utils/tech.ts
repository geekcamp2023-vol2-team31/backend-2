import { source } from "@/database";
import { Tech } from "@/entity";

const getOrCreateTech = async (name: string) => {
  const tech = await source.manager.findOneBy(Tech, { name });
  if (tech) return tech;
  const newTech = new Tech();
  newTech.name = name;
  await source.manager.save(newTech);
  return newTech;
};

export { getOrCreateTech };
