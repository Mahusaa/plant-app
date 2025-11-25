import { getPlants } from "@/db/queries/plants";
import PlantsListClient from "./plants-list-client";

interface PlantsListProps {
  userId: string;
}

export default async function PlantsList({ userId }: PlantsListProps) {
  // Fetch user's plants from PostgreSQL
  const plants = await getPlants({ userId });

  return <PlantsListClient plants={plants} />;
}
