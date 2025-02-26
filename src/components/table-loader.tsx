import { Skeleton } from "@/components/ui/skeleton";

export default function TableLoader() {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center gap-3">
        <Skeleton className="h-10 w-1/4" /> {/* Filter input */}
        <div className="flex space-x-3">
          <Skeleton className="h-10 w-24" /> {/* Columns button */}
          <Skeleton className="h-10 w-32" /> {/* Batch Update button */}
        </div>
      </div>

      <div className="rounded-lg">
        <div className="grid grid-cols-6 gap-2 p-3 border-b bg-gray-50 dark:bg-transparent">
          {[
            "Order Number",
            "Customer Name",
            "Phone Number",
            "Payment Status",
            "Delivery Status",
            "Location",
          ].map((col, index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </div>

        {[...Array(5)].map((_, index) => (
          <div key={index} className="grid grid-cols-6 gap-2 p-3">
            {[...Array(6)].map((_, idx) => (
              <Skeleton key={idx} className="h-6 w-full" />
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-6 w-24" /> {/* Rows per page */}
        <Skeleton className="h-6 w-16" /> {/* Page navigation */}
      </div>
    </div>
  );
}
