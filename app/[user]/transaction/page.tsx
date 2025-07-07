"use client";

import { columns, TransactionRow } from "./transaction-tables/columns";
import { DataTable } from "./transaction-tables/data-table";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import AddTransactionModal from "@/components/new-transaction-popup";
import UploadReceiptModal from "@/components/new-ai-parse";
import { Input } from "@/components/ui/input";
import { getTransactions } from "@/supabase/get-transaction-function";
import EditTransactionModal from "@/components/edit-transaction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { Label } from "@/components/ui/label";

export default function TransactionPage() {
  dayjs.extend(customParseFormat);

  const supabase = createClient();
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionRow | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all"); 
  const [availableCategories, setAvailableCategories] = useState<
    { id: string; name: string }[]
  >([]);

  const fetchTransactions = useCallback(async () => {
    const data = await getTransactions();
    if (data) {
      setTransactions(data);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name");
    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setAvailableCategories(data || []);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  const filteredTransactions = useMemo(() => {
    let currentFilteredTransactions = transactions.filter((t) =>
      t.vendor.toLowerCase().includes(searchText.toLowerCase())
    );

    if (filterType !== "all") {
      currentFilteredTransactions = currentFilteredTransactions.filter(
        (t) => t.type === filterType
      );
    }

    if (filterCategory !== "all") {
      currentFilteredTransactions = currentFilteredTransactions.filter((t) => {
        const categoryObj = availableCategories.find(
          (cat) => cat.name === t.category
        );
        return categoryObj && categoryObj.id === filterCategory;
      });
    }

    // Sort from latest to oldest
    currentFilteredTransactions.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

    return currentFilteredTransactions;
  }, [
    transactions,
    searchText,
    filterType,
    filterCategory, // Add filterCategory to dependencies
    availableCategories,
  ]);

  const currentMonthTransactions = useMemo(() => {
    const now = dayjs();
    return filteredTransactions.filter(
      (t) =>
        dayjs(t.date).month() === now.month() &&
        dayjs(t.date).year() === now.year()
    );
  }, [filteredTransactions]);

  const handleEditTransaction = useCallback((transaction: TransactionRow) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  }, []);

  const tableColumns = useMemo(() => {
    return columns(handleEditTransaction);
  }, [handleEditTransaction]);

  return (
    <div className="transition-all duration-300 py-10 px-6 md:px-10 w-full md:w-[100vw] lg:w-[85vw] lg:mx-auto">
      <div className="flex flex-col gap-2 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 lg:mb-0">
            Transactions
          </h1>
          <div className="flex flex-col gap-2 sm:flex-col md:flex-col lg:hidden">
            <AddTransactionModal onTransactionAdded={fetchTransactions} />
            <UploadReceiptModal onTransactionAdded={fetchTransactions} />
          </div>
        </div>
        <div className="hidden lg:flex lg:flex-row lg:items-center gap-2">
          <AddTransactionModal onTransactionAdded={fetchTransactions} />
          <UploadReceiptModal onTransactionAdded={fetchTransactions} />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex flex-wrap gap-2 mb-4">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="currentMonth">This Month</TabsTrigger>
        </TabsList>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-full">
          <div>
            <Label htmlFor="search-vendor">Search Vendor</Label>
            <div className="mt-3">
              <Input
                id="search-vendor"
                placeholder="Search vendor..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="filter-type">Filter by Type</Label>
            <div className="mt-3">
              <Select onValueChange={setFilterType} value={filterType}>
                <SelectTrigger id="filter-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="filter-category">Filter by Category</Label>
            <div className="mt-3">
              <Select onValueChange={setFilterCategory} value={filterCategory}>
                <SelectTrigger id="filter-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <TabsContent className="md:w-[90vw] lg:w-[73vw]" value="all">
          <DataTable columns={tableColumns} data={filteredTransactions} />
        </TabsContent>

        <TabsContent className="md:w-[90vw] lg:w-[73vw]" value="currentMonth">
          <DataTable columns={tableColumns} data={currentMonthTransactions} />
        </TabsContent>
      </Tabs>

      {selectedTransaction && (
        <EditTransactionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTransaction(null);
          }}
          transaction={selectedTransaction}
          onTransactionUpdated={fetchTransactions}
        />
      )}
    </div>
  );
}