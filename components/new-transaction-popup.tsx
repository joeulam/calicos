"use client";

import { toast, Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { getUser } from "@/supabase/user-function";
import CreatableSelect from "react-select/creatable";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { OptionType } from "./new-budget-popup";

const formSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  created_at: z.date(),
  date: z.date(),
  vendor: z.string().min(1, "Vendor is required"),
  total: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().optional(),
  type: z.enum(["expense", "income"]),
  categories: z.array(z.string()).optional(),
});

export default function AddTransactionModal({
  onTransactionAdded,
}: {
  onTransactionAdded?: () => void;
}) {  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      created_at: new Date(),
      date: new Date(),
      vendor: "",
      description: "",
      type: "expense",
      categories: [],
    },
  });
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("*");

      if (data) {
        const formatted = data.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }));
        setCategories(formatted);
      }
    };

    fetchCategories();
  }, []);
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const user = await getUser();
      if (!user.user) {
        toast.error("Not authenticated");
        return;
      }
  
      const supabase = createClient();
      const transactionId = crypto.randomUUID();
  
      const { categories = [], ...rest } = values;
  
      const transactionPayload = {
        ...rest,
        id: transactionId,
        user_id: user.user.id,
        created_at: new Date(),
      };
  
      const { error: txError } = await supabase
        .from("transactions")
        .insert(transactionPayload);
  
      if (txError) {
        toast.error("Failed to add transaction.");
        console.error(txError);
        return;
      }
  
      const categoryRows = categories.map((categoryId) => ({
        transaction_id: transactionId,
        category_id: categoryId,
      }));
  
      if (categoryRows.length > 0) {
        const { error: catError } = await supabase
          .from("transaction_categories")
          .insert(categoryRows);
  
        if (catError) {
          toast.error("Failed to link categories.");
          console.error(catError);
          return;
        }
      }
      if (onTransactionAdded) onTransactionAdded();
      toast.success("Transaction added!");
      form.reset();
    } catch (err) {
      toast.error("Unexpected error occurred.");
      console.error(err);
    }
  }
  
  

  return (
    <Dialog>
      <Toaster />
      <DialogTrigger>
        <Button className="w-[90vw] lg:w-15/16">Add new transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-xl font-bold">New Transaction</DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date Field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MM/dd/yy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="expense"
                        checked={field.value === "expense"}
                        onChange={() => field.onChange("expense")}
                      />
                      <span>Expense</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="income"
                        checked={field.value === "income"}
                        onChange={() => field.onChange("income")}
                      />
                      <span>Income</span>
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Vendor Field */}
            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Starbucks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount Field */}
            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="14.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <CreatableSelect
                      isClearable
                      isMulti 
                      placeholder="Select or create categories"
                      onChange={async (selectedOptions) => {
                        const supabase = createClient();
                        const user = await getUser();
                        if (!user.user) return;

                        const processed: { label: string; value: string }[] =
                          [];

                        for (const option of selectedOptions) {
                          if ((option as OptionType).__isNew__) {
                            const { data, error } = await supabase
                              .from("categories")
                              .insert({
                                name: option.label,
                                user_id: user.user.id,
                              })
                              .select()
                              .single();

                            if (error) {
                              toast.error("Failed to create category.");
                              continue;
                            }

                            processed.push({
                              label: data.name,
                              value: data.id,
                            });
                          } else {
                            processed.push({
                              label: option.label,
                              value: option.value,
                            });
                          }
                        }

                        const newIds = processed.map((cat) => cat.value);
                        field.onChange(newIds);

                        setCategories((prev) => {
                          const existing = new Set(prev.map((c) => c.value));
                          return [
                            ...prev,
                            ...processed.filter((c) => !existing.has(c.value)),
                          ];
                        });
                      }}
                      options={categories}
                      value={categories.filter((opt) =>
                        field.value?.includes(opt.value)
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Optional notes..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex">
              <DialogClose asChild>
                <Button className="mr-5" type="submit">
                  Submit
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>

            </div>
          </form>
        </Form>{" "}
      </DialogContent>
    </Dialog>
  );
}
