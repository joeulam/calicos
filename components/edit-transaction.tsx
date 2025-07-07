"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionRow } from "@/app/[user]/transaction/transaction-tables/columns";

dayjs.extend(customParseFormat);

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionRow;
  onTransactionUpdated: () => void;
}

export default function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
  onTransactionUpdated,
}: EditTransactionModalProps) {
  const supabase = createClient();

  const [vendor, setVendor] = useState(transaction.vendor || "");
  const [total, setTotal] = useState(transaction.total || 0);
  const [date, setDate] = useState(dayjs(transaction.date).format("YYYY-MM-DD") || "");
  const [description, setDescription] = useState(transaction.description || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [type, setType] = useState(transaction.type || "expense");
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from("categories").select("id, name");
      if (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      } else {
        setAvailableCategories(data || []);
        if (transaction.category) {
          const initialCategory = data?.find(cat => cat.name === transaction.category);
          if (initialCategory) {
            setSelectedCategoryId(initialCategory.id);
          }
        }
      }
    }
    fetchCategories();
  }, [supabase, transaction.category]);

  useEffect(() => {
    if (transaction) {
      setVendor(transaction.vendor || "");
      setTotal(transaction.total || 0);
      setDate(dayjs(transaction.date).format("YYYY-MM-DD") || "");
      setDescription(transaction.description || "");
      setType(transaction.type || "expense");
      if (availableCategories.length > 0) {
        const initialCategory = availableCategories.find(cat => cat.name === transaction.category);
        if (initialCategory) {
          setSelectedCategoryId(initialCategory.id);
        } else {
          setSelectedCategoryId(null);
        }
      }
    }
  }, [transaction, availableCategories]);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to update transactions.");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("transactions")
        .update({
          vendor,
          total: parseFloat(total.toString()),
          date: date,
          category_id: selectedCategoryId,
          description,
          type,
          user_id: user.id,
        })
        .eq("id", transaction.id);

      if (error) {
        throw error;
      }

      toast.success("Transaction updated successfully!");
      onTransactionUpdated();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Failed to update transaction: ${error.message}`);
        console.error("Error updating transaction:", error);
      } else {
        toast.error("Failed to update transaction: An unknown error occurred.");
        console.error("Error updating transaction:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [vendor, total, date, selectedCategoryId, description, type, transaction.id, onTransactionUpdated, onClose, supabase]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Transaction</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Make changes to your transaction here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vendor" className="text-right">
              Vendor
            </Label>
            <Input
              id="vendor"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="col-span-3"
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total" className="text-right">
              Total
            </Label>
            <Input
              id="total"
              type="number"
              value={total}
              onChange={(e) => setTotal(parseFloat(e.target.value))}
              className="col-span-3"
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3"
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select onValueChange={setSelectedCategoryId} value={selectedCategoryId || ""} disabled={loading}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-background text-foreground">
                {availableCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select onValueChange={setType} value={type} disabled={loading}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-background text-foreground">
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}