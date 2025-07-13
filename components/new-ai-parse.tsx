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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { submitTransaction } from "@/supabase/submit-transaction";
import { getUser } from "@/supabase/user-function";
import { createClient } from "@/utils/supabase/client";

export default function UploadReceiptModal({
  onTransactionAdded,
}: {
  onTransactionAdded?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedResult, setParsedResult] = useState<null | {
    title: string;
    amount: number;
    date: string;
    category: string;
  }>(null);

  const handleSubmit = async () => {
    if (!parsedResult) return;

    const user = await getUser();
    const userId = user?.user?.id;
    if (!userId) {
      toast.error("User not found");
      return;
    }

    const transactionId = crypto.randomUUID();
    const transactionData = {
      id: transactionId,
      user_id: userId,
      vendor: parsedResult.title,
      description: parsedResult.title,
      total: parsedResult.amount,
      date: new Date(parsedResult.date),
      created_at: new Date(),
      type: "expense",
    };

    try {
      await submitTransaction(transactionData);
      const supabase = createClient();
      const { error: linkError } = await supabase
        .from("transaction_categories")
        .insert([
          {
            transaction_id: transactionId,
            category_id: parsedResult.category,
          },
        ]);

      if (linkError) {
        console.error(linkError);
        toast.error("Transaction created, but failed to link category.");
        return;
      }

      toast.success("Transaction + category saved!");
      setParsedResult(null);
      setFile(null);
      if (onTransactionAdded) onTransactionAdded();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit transaction.");
    }
  };

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
        toast.error(result.error || "Failed to parse receipt");
        return;
      }

      setParsedResult(result);
      toast.success("Receipt parsed successfully!");
      if (onTransactionAdded) onTransactionAdded();
    } catch (err) {
      toast.error("Error uploading receipt");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("id, name");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <Dialog>
      <DialogTrigger>
        {/* <Button className="w-[90vw] lg:w-15/16" variant={`outline`}>
          Upload Receipt
        </Button> */}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-xl font-bold">
          Upload Receipt
        </DialogHeader>
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

        {parsedResult && (
          <div className="mt-4 space-y-2">
            <div>
              <label className="text-sm text-gray-500">Title</label>
              <Input value={parsedResult.title} readOnly />
            </div>
            <div>
              <label className="text-sm text-gray-500">Amount</label>
              <Input value={`$${parsedResult.amount}`} readOnly />
            </div>
            <div>
              <label className="text-sm text-gray-500">Date</label>
              <Input value={parsedResult.date} readOnly />
            </div>
            <div>
              <label className="text-sm text-gray-500">Category</label>
              <Input
                value={
                  categories.find((cat) => cat.id === parsedResult.category)
                    ?.name || parsedResult.category
                }
                readOnly
              />
            </div>

            <div className="pt-2">
              <DialogClose asChild>
                <Button onClick={handleSubmit} className="w-full">
                  Submit to Supabase
                </Button>
              </DialogClose>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
