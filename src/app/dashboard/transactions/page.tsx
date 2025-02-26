import sampleOrders from "@/app/const/data";
import PageHeader from "@/components/page-header";
import { columns } from "@/components/table/columns/order";
import { DataTable } from "@/components/table/data-table";
import React from "react";

const TransactionsPage = () => {
  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Manage and track customer transactions."
        action="Add Transaction"
      />
      <div className="w-full">
        <DataTable data={sampleOrders} columns={columns} />
      </div>
    </div>
  );
};

export default TransactionsPage;
