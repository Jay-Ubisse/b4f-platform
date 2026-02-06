import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateInterviewBookingUrl } from "@/services/editions";
import { useEdition } from "@/contexts/edition-contentx";

export function InterviewBookingDialog({
  interviewBookingUrl,
  editionId,
}: {
  interviewBookingUrl?: string;
  editionId: string;
}) {
  const [url, setUrl] = useState<string>(interviewBookingUrl ?? "");
  const { changeEdition, edition } = useEdition();
  const t = useTranslations("Dashboard.InterviewsPage.BookingDialog");

  async function handleBookingUrlSave() {
    toast.success(
      interviewBookingUrl
        ? t("OnSubmitUpdateLoading")
        : t("OnSubmitSaveLoading"),
      { id: "1" }
    );

    const response = await updateInterviewBookingUrl({
      editionId,
      interviewBookingUrl: url,
    });

    if (response.status === 200) {
      const updatedEdition = { ...edition!, interviewBookingUrl: url };

      changeEdition(updatedEdition);
      toast.success(
        interviewBookingUrl
          ? t("OnSubmitUpdateSuccess")
          : t("OnSubmitSaveSuccess"),
        { id: "1" }
      );
    } else {
      toast.error(
        interviewBookingUrl ? t("OnSubmitUpdateError") : t("OnSubmitSaveError"),
        { id: "1" }
      );
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {interviewBookingUrl ? (
          <Button variant="ghost" size="icon" title="Editar link">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline">{t("TriggerButton")}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Title")}</DialogTitle>
          <DialogDescription>{t("Description")}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              {t("InputLabel")}
            </Label>
            <Input
              placeholder={t("InputPlaceholder")}
              onChange={(e) => setUrl(e.target.value)}
              value={url}
            />
          </div>
        </div>
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="default"
              onClick={handleBookingUrlSave}
            >
              {interviewBookingUrl
                ? t("UpdateButtonLabel")
                : t("SaveButtonLabel")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
