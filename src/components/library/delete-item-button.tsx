"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ApiError, deleteKnowledgeItem } from "@/lib/api";

export function DeleteItemButton({
  itemId,
  itemTitle,
}: {
  itemId: string;
  itemTitle: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    if (pending && !next) return;
    setOpen(next);
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteKnowledgeItem(itemId);
        toast.success("Item deleted");
        setOpen(false);
        router.push("/library");
        router.refresh();
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Could not delete this item";
        toast.error(message);
      }
    });
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 text-destructive hover:bg-destructive/10"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-3.5" />
        Delete
      </Button>

      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{itemTitle}&rdquo; will be removed from your library. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={pending}
              onClick={handleDelete}
            >
              {pending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
