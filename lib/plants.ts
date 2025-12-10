// Plant data types and storage utilities
import type { IdentifyResult } from "./ai-schema";

export type Plant = {
  id: string;
  name: string;
  species: string;
  dateAdded: string;
  location: string;
  notes?: string;
  imageUrl?: string;
  identifyData?: IdentifyResult;
};

export type CreatePlantInput = Omit<Plant, "id" | "dateAdded">;

// Storage key for localStorage
const STORAGE_KEY = "plant-app-plants";

// Get all plants from storage
export function getPlants(): Plant[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Get a single plant by ID
export function getPlant(id: string): Plant | null {
  const plants = getPlants();
  return plants.find((p) => p.id === id) || null;
}

// Add a new plant
export function addPlant(input: CreatePlantInput): Plant {
  const plants = getPlants();
  const newPlant: Plant = {
    ...input,
    id: crypto.randomUUID(),
    dateAdded: new Date().toISOString(),
  };

  plants.push(newPlant);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));

  return newPlant;
}

// Update an existing plant
export function updatePlant(
  id: string,
  updates: Partial<CreatePlantInput>,
): Plant | null {
  const plants = getPlants();
  const index = plants.findIndex((p) => p.id === id);

  if (index === -1) return null;

  plants[index] = { ...plants[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));

  return plants[index];
}

// Delete a plant
export function deletePlant(id: string): boolean {
  const plants = getPlants();
  const filtered = plants.filter((p) => p.id !== id);

  if (filtered.length === plants.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// Clear all plants (useful for testing)
export function clearPlants(): void {
  localStorage.removeItem(STORAGE_KEY);
}
