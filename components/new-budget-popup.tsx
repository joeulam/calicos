"use client";

import { toast, Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  user_id: z.string().optional(),
  created_at: z.date(),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  categories: z.array(z.string()).optional(),
});

export type OptionType = {
  label: string;
  value: string;
  __isNew__?: boolean; 
};

export default function AddNewBudget({
  onBudgetAdded,
}: {
  onBudgetAdded: () => void;
}) {  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      created_at: new Date(),
      title: "",
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
        .from("budgets")
        .insert(transactionPayload);
  
      if (txError) {
        toast.error("Failed to add budget.");
        console.error("failed:" + txError.cause);
        return;
      }
  
      const categoryRows = categories.map((categoryId) => ({
        budget_id: transactionId,
        category_id: categoryId,
      }));
  
      if (categoryRows.length > 0) {
        const { error: catError } = await supabase
          .from("budget_categories")
          .insert(categoryRows);
  
        if (catError) {
          toast.error("Failed to link categories.");
          console.error(catError);
          return;
        }
      }
      onBudgetAdded();
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
        <Button>Add new Budget</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>New Budget</DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Name</FormLabel>
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
              name="amount"
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

                        const processed: { label: string; value: string
                        }[] =
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
