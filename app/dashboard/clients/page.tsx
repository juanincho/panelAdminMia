import { Suspense } from "react";
import TravelersTable from "./_components/clientsPage";

export default function TravelersPage() {
  return (
    <div className="min-h-screen">
      <main className="container">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
                <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-36 bg-gray-200 rounded"></div>
              </div>
            </div>
          }
        >
          <TravelersTable />
        </Suspense>
      </main>
    </div>
  );
}
