"use client";

import { UseOrders } from "@/app/services/queries/orders";
import PageHeader from "@/components/page-header";
import TableLoader from "@/components/table-loader";
import { columns } from "@/components/table/columns/order";
import { DataTable } from "@/components/table/data-table";
import Link from "next/link";

const OrdersPage = () => {
  const { data, isLoading } = UseOrders();
  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Manage and track customer orders."
        action={<Link href="/dashboard/orders/add">New Order</Link>}
      />
      {isLoading ? (
        <TableLoader />
      ) : (
        <div className="w-full">
          <DataTable data={data} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
