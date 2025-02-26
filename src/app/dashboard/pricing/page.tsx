import sampleOrders from "@/app/const/data";
import PageHeader from "@/components/page-header";
import { columns } from "@/components/table/columns/order";
import { DataTable } from "@/components/table/data-table";
import React from "react";

const PricingPage = () => {
  return (
    <div>
      <PageHeader
        title="Pricing"
        subtitle="Manage and track pricing plans."
        action="Add Pricing"
      />
      <div className="w-full">
        <DataTable data={sampleOrders} columns={columns} />
      </div>
    </div>
  );
};

export default PricingPage;
