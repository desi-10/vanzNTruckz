import PageHeader from "@/components/page-header";
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
        {/* <DataTable data={sampleOrders} columns={columns} /> */}
      </div>
    </div>
  );
};

export default CustomersPage;
