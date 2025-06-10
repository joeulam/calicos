"use client";

import "../../globals.css";


export default function Dashboard() {
  return (
    <div
      className={`transition-all duration-300 py-10 px-6 md:px-10 w-[100vw] md:w-[80vw]`}
    >
      <div className="md:px-20 px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <span className="font-medium">userName</span>
          </p>
        </div>
      </div>
    </div>
  );
}
