export default function BudgetTitle({ monthDisplay }: { monthDisplay: string }) {
  return (
    <div>
      <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100">Budget Overview</h1>
      <p className="text-sm text-muted-foreground">
        Summary for {monthDisplay}
      </p>
    </div>
  );
}