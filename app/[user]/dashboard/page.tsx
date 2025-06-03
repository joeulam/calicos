import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import "../../globals.css";
import { dashboardCards } from "@/app/dummy/dashcard-mock";
import { ChartBarHorizontal } from "@/components/bar-chart";
export default function Dashboard() {
  return (
    <div className="p-36 w-[100vw] justify-center ">
      <h1>Welcome back</h1>
      <p></p>
      <div className="flex justify-between mt-5">
        {dashboardCards.map((item, index) => (
          <Card className="w-2/12 " key={index}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.amount}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{item.subTitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-5 p-10">
        <ChartBarHorizontal title="Expense Catagory" dateRange=""/>
      </div>
      <div className="mt-5 p-10">
        <ChartBarHorizontal title="Income Catagory" dateRange=""/>
      </div>
    </div>
  );
}
