import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  itemID: string | number | undefined;
  buttonLabel?: string;
  title: string;
  description: string;
  onConfirm: ({ itemID }: { itemID: string | number | undefined }) => void;
}

export function ConfirmDialog({
  itemID,
  title,
  buttonLabel,
  description,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size={"sm"} variant={"destructive"} className="flex gap-2">
          <CircleX size={20} />
          <span>{buttonLabel ? buttonLabel : "Eliminar"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose className="flex gap-2">
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
            <Button
              onClick={() => onConfirm({ itemID })}
              variant={"destructive"}
            >
              Eliminar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
