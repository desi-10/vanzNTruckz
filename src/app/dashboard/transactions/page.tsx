import PageHeader from "@/components/page-header";
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
        {/* <DataTable data={sampleOrders} columns={columns} /> */}
      </div>
    </div>
  );
};

export default TransactionsPage;
