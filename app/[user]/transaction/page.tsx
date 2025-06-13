"use client";
import { columns, TransactionRow } from "./transaction-tables/columns";
import { DataTable } from "./transaction-tables/data-table";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import AddTransactionModal from "@/components/new-transaction-popup";
import { getTransactions } from "@/supabase/get-transaction-function";
import UploadReceiptModal from "@/components/new-ai-parse";
import { Input } from "@/components/ui/input";

export default function Transaction() {
  dayjs.extend(customParseFormat);

  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  async function getTransactionData() {
    const data = await getTransactions();
    if (data) {
      setTransactions(data);
    }
  }

  useEffect(() => {
    getTransactionData();
  }, [transactions]);

  const filteredData = transactions.filter((tx) =>
    tx.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMonth = dayjs().month();
  const currentMonthData = filteredData.filter(
    (d) => dayjs(d.date).month() === currentMonth
  );
  console.log(transactions);

  return (
    <div className="transition-all duration-300 py-10 px-4 sm:px-6 md:px-10 w-full md:w-[80vw] mx-auto">
      <div className="flex flex-col gap-2 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 lg:mb-0">
            Transactions
          </h1>

          <div className="flex flex-col gap-2 sm:flex-col md:flex-col lg:hidden">
            <AddTransactionModal />
            <UploadReceiptModal />
          </div>
        </div>

        <div className="hidden lg:flex lg:flex-row lg:items-center gap-2">
          <AddTransactionModal />
          <UploadReceiptModal />
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <TabsContent className="md:w-[90vw] lg:w-[70vw]" value="all">
          <DataTable columns={columns} data={filteredData} />
        </TabsContent>

        <TabsContent className="md:w-[90vw] lg:w-[70vw]" value="currentMonth">
          <DataTable columns={columns} data={currentMonthData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
