"use client";
import { columns } from "./transaction-tables/columns";
import { DataTable } from "./transaction-tables/data-table";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import AddTransactionModal from "@/components/new-transaction-popup";

export default function Transaction() {
  dayjs.extend(customParseFormat);

  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetched = [
      {
        id: "1",
        total: 100,
        date: dayjs("06-01-2025", "MM-DD-YYYY").toDate(),
        vendor: "Mcdonalds",
      },
      {
        id: "2",
        total: 25,
        date: dayjs("05-20-2025", "MM-DD-YYYY").toDate(),
        vendor: "Target",
      },
    ];
    setTransactions(fetched);
  }, []);

  const filteredData = transactions.filter((tx) =>
    tx.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMonth = dayjs().month();
  const currentMonthData = filteredData.filter(
    (d) => dayjs(d.date).month() === currentMonth
  );

  return (
    <div className="transition-all duration-300 py-10 px-4 sm:px-6 md:px-10 w-[100vw] md:w-[80vw]">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        </div>
        <div className="flex justify-start sm:justify-end">
          <AddTransactionModal />
        </div>
      </div>

      <div className="w-full sm:max-w-lg mb-6">
        <Input
          placeholder="Search vendor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex flex-wrap gap-2 mb-4">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="currentMonth">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable columns={columns} data={filteredData} />
        </TabsContent>

        <TabsContent value="currentMonth">
          <DataTable columns={columns} data={currentMonthData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
