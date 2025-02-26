import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { UseOrders } from "@/app/services/queries/orders";
import { useState } from "react";

interface PaginationProps<TData> {
  table: Table<TData>;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function Pagination<TData>({
  table,
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: PaginationProps<TData>) {
  // Generate an array of pages with ellipses
  const [currentPage, setCurrentPage] = useState(1);

  UseOrders(currentPage);

  console.log("Current Page:", currentPage);

  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (page >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-end space-x-2 mt-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      {/* Previous Button */}
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={!hasPrevPage}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>

      {/* Page Numbers with Ellipses */}
      {getPages().map((p, index) =>
        typeof p === "number" ? (
          <Button
            key={index}
            variant={p === page ? "default" : "outline"}
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(p)}
          >
            {p}
          </Button>
        ) : (
          <span key={index} className="px-2 text-muted-foreground">
            {p}
          </span>
        )
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={!hasNextPage}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
