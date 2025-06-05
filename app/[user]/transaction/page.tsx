"use client";
import { columns } from "./transaction-tables/columns";
import { DataTable } from "./transaction-tables/data-table";
import { useSidebar } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import AddTransactionModal from "@/components/new-transaction-popup";

export default function Transaction() {
  dayjs.extend(customParseFormat);
  const allData = [
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
  const currentMonth = dayjs().month();
  const currentMonthData = allData.filter(
    (d) => dayjs(d.date).month() === currentMonth
  );
  const { state } = useSidebar();
  return (
    <div
      className={`transition-all duration-300 py-10 px-6 md:px-10 ${
        state === "expanded"
          ? "w-[80vw] sm:w-[100vw]"
          : "mx-auto w-[100vw] sm:w-[100vw]"
      }`}
    >
      <div className="flex items-center flex-col">
        <div className="flex justify-between w-11/12">
          <h1 className="text-2xl font-bold bottom-0">Transaction</h1>
          <AddTransactionModal />
        </div>
        <div className="w-11/12 mt-2">
          <Input />
        </div>
        <div className="items-center w-11/12 mt-5">
          <Tabs defaultValue="all" className="">
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="currentMonth">This Month</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <DataTable columns={columns} data={allData} />
            </TabsContent>
            <TabsContent value="currentMonth">
              <DataTable columns={columns} data={currentMonthData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
