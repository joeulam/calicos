import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export interface DataCards {
  title: string;
  amount: number;
  subTitle: string;
  progress: number;
}

export function BudgetCards({ initialBudgetCardData }: { initialBudgetCardData: DataCards[] }) {
  if (!initialBudgetCardData || initialBudgetCardData.length === 0) {
    return (
      <Card className="h-24 rounded-md border shadow-sm flex items-center justify-center">
        <CardHeader>
          <CardTitle className="text-center">Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {initialBudgetCardData.map((item, index) => (
        <Card
          key={index}
          className="h-24 rounded-md border border-muted shadow-sm hover:shadow transition relative overflow-hidden"
        >
          <CardHeader className="p-2 -mt-5">
            <div className="flex flex-col gap-0.5">
              <CardTitle className="text-sm text-gray-700 font-normal">
                {item.title}
              </CardTitle>
              <div className="text-lg font-semibold text-primary">
                ${item.amount.toFixed(2)}
              </div>
              <CardDescription className="text-xs text-muted-foreground leading-tight">
                {item.subTitle}
              </CardDescription>
            </div>
          </CardHeader>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${item.progress}%` }}
            ></div>
          </div>
        </Card>
      ))}
    </div>
  );
}
