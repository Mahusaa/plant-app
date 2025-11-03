"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { deletePlant, type Plant } from "@/lib/plants";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface DetailHeaderProps {
  plant: Plant;
}

export function DetailHeader({ plant }: DetailHeaderProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      deletePlant(plant.id);
      router.push("/plants");
    } catch (error) {
      alert("Failed to delete plant. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <Link href="/plants" className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
          <svg className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-base font-semibold text-slate-900">{plant.name}</h1>
        <div className="flex gap-2">
          <Link href={`/plants/${plant.id}/edit`}>
            <Button
              size="sm"
              variant="outline"
              className="h-9 px-3"
              data-testid="edit-plant-button"
            >
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            data-testid="delete-plant-button"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="w-[90vw] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Delete Plant?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-slate-600">
              Are you sure you want to delete <span className="font-semibold">{plant.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                data-testid="confirm-delete-button"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
