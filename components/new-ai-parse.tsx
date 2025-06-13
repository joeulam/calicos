"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function UploadReceiptModal({
  onTransactionAdded,
}: {
  onTransactionAdded?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return toast.error("Please upload a file");

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("receipt", file);

      const res = await fetch("/api/parse-receipt", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error("Failed to parse receipt");
        return;
      }
      if (onTransactionAdded) {onTransactionAdded(); }
      toast.success("Receipt parsed successfully!");
      console.log("Parsed Data:", result);


    } catch (err) {
      toast.error("Error uploading receipt");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
      <Button className="w-[90vw] lg:w-15/16" variant={`outline`}>Upload Receipt</Button>

      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-xl font-bold">Upload Receipt</DialogHeader>
        <Input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <div className="flex gap-4 mt-4">
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Parse Receipt"}
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
