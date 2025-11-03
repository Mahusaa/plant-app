"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addPlant } from "@/lib/plants";
import { Button } from "@/components/ui/button";

export default function AddPlantPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    location: "",
    notes: "",
    imageUrl: "/nanas.png", // Default image
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Plant name is required";
    if (!formData.species.trim()) newErrors.species = "Species is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const newPlant = addPlant(formData);
      router.push(`/plants/${newPlant.id}`);
    } catch (error) {
      alert("Failed to add plant. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <main className="p-4 sm:p-6 space-y-6 max-w-2xl mx-auto bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-300 flex items-center justify-center">
            <span className="text-2xl">🌱</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Add New Plant</h1>
            <p className="text-sm text-slate-500">Add a plant to your collection</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Plant Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-slate-700">
            Plant Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g., Monstera"
            className={`w-full h-12 rounded-xl border ${errors.name ? "border-red-500" : "border-slate-300"} px-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm`}
            data-testid="plant-name-input"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Species */}
        <div className="space-y-2">
          <label htmlFor="species" className="text-sm font-semibold text-slate-700">
            Species <span className="text-red-500">*</span>
          </label>
          <input
            id="species"
            type="text"
            value={formData.species}
            onChange={(e) => handleChange("species", e.target.value)}
            placeholder="e.g., Monstera Deliciosa"
            className={`w-full h-12 rounded-xl border ${errors.species ? "border-red-500" : "border-slate-300"} px-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm`}
            data-testid="plant-species-input"
          />
          {errors.species && <p className="text-sm text-red-500">{errors.species}</p>}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-semibold text-slate-700">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="e.g., Living Room"
            className={`w-full h-12 rounded-xl border ${errors.location ? "border-red-500" : "border-slate-300"} px-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm`}
            data-testid="plant-location-input"
          />
          {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-semibold text-slate-700">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Add any additional notes about your plant..."
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
            data-testid="plant-notes-input"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Link
            href="/plants"
            className="flex-1 h-12 px-6 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 text-slate-700 font-medium hover:from-slate-200 hover:to-slate-300 flex items-center justify-center"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-12 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg disabled:opacity-50"
            data-testid="submit-plant-button"
          >
            {isSubmitting ? "Adding..." : "Add Plant"}
          </Button>
        </div>
      </form>
    </main>
  );
}
