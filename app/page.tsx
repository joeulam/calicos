"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 font-sans antialiased">
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-end z-10">
        <nav className="space-x-4">
          <Button variant="ghost" onClick={() => router.push("/login")}>
            Login
          </Button>
          <Button onClick={() => router.push("/signup")}>Sign up</Button>
        </nav>
      </header>

      <section className="relative flex items-center justify-center min-h-screen text-center px-4 py-20 md:py-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight drop-shadow-lg">
            Welcome to <span className="text-blue-600">Calico</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Your **AI-powered financial budgeting app** designed to make
            managing money effortless and smart.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform transition-transform duration-200 hover:scale-105"
              onClick={() => router.push("/signup")}
            >
              Get Started for Free
            </Button>
            <Button
              size="lg"
              className="bg-white hover:bg-gray-50 text-black shadow-lg transform transition-transform duration-200 hover:scale-105"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Learn more
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-6 md:px-10" id="features">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <h2 className="text-4xl font-bold text-gray-900">
            Smart Features for Smarter Finances
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calico combines powerful AI with intuitive design to give you a
            complete picture of your financial health.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl hover:scale-[1.02] transform">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-area-chart"
                >
                  <path d="M3 3v18h18" />
                  <path d="M7 12v5h12V8l-5 5-4-4Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Intelligent Budgeting
              </h3>
              <p className="text-gray-600">
                Let AI analyze your spending patterns and suggest personalized
                budget categories, helping you stay on track effortlessly.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl hover:scale-[1.02] transform">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-receipt"
                >
                  <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2h-2V1h-2v1H8V1H6v1Z" />
                  <path d="M10 12h4" />
                  <path d="M10 16h4" />
                  <path d="M10 8h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Automated Transaction Categorization
              </h3>
              <p className="text-gray-600">
                No more manual sorting! Our AI automatically categorizes your
                transactions, saving you time and ensuring accuracy.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl hover:scale-[1.02] transform">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-trending-up"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Actionable Insights & Reports
              </h3>
              <p className="text-gray-600">
                Get personalized recommendations and clear reports that
                highlight spending trends, saving opportunities, and financial
                goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16 px-6 md:px-10 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg opacity-90">
            Join thousands of users who are making smarter financial decisions
            with Calico. It's free to start!
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl transform transition-transform duration-200 hover:scale-105"
            onClick={() => router.push("/signup")}
          >
            Start Your Calico Journey Today
          </Button>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-300 py-8 px-6 md:px-10 text-center text-sm">
        <div className="max-w-6xl mx-auto">
          <p>&copy; {new Date().getFullYear()} Calico. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
