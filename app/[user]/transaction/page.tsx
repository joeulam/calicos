"use client";

import { columns, TransactionRow } from "./transaction-tables/columns";
import { DataTable } from "./transaction-tables/data-table";
import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import AddTransactionModal from "@/components/new-transaction-popup";
import UploadReceiptModal from "@/components/new-ai-parse";
import { Input } from "@/components/ui/input";
import { getTransactions } from "@/supabase/get-transaction-function";

export default function TransactionPage() {
  dayjs.extend(customParseFormat);

  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [searchText, setSearchText] = useState("");

  const fetchTransactions = useCallback(async () => {
    const data = await getTransactions();
    if (data) {setTransactions(data)};
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = transactions.filter((t) =>
    t.vendor.toLowerCase().includes(searchText.toLowerCase())
  );

  const currentMonth = dayjs().month();
  const currentMonthTransactions = filteredTransactions.filter(
    (t) => dayjs(t.date).month() === currentMonth && dayjs(t.date).year() == dayjs().year()
  );

  return (
    <div className="transition-all duration-300 py-10 px-6 md:px-10 w-full md:w-[100vw] lg:w-[85vw] lg:mx-auto">
      <div className="flex flex-col gap-2 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 lg:mb-0">
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

        <div className="mb-6 max-w-md">
          <Input
            placeholder="Search vendor..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <TabsContent className="md:w-[90vw] lg:w-[73vw]" value="all">
          <DataTable columns={columns} data={filteredTransactions} />
        </TabsContent>

        <TabsContent className="md:w-[90vw] lg:w-[73vw]" value="currentMonth">
          <DataTable columns={columns} data={currentMonthTransactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
