import sampleOrders from "@/app/const/data";
import PageHeader from "@/components/page-header";
import { columns } from "@/components/table/columns/order";
import { DataTable } from "@/components/table/data-table";
import React from "react";

const CustomersPage = () => {
  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Manage and track customers."
        action="Add Customer"
      />
      <div className="w-full">
        <DataTable data={sampleOrders} columns={columns} />
      </div>
    </div>
  );
};

export default CustomersPage;
