import sampleOrders from "@/app/const/data";
import PageHeader from "@/components/page-header";
import { columns } from "@/components/table/columns/order";
import { DataTable } from "@/components/table/data-table";
import React from "react";

const DispatchesPage = () => {
  return (
    <div>
      <PageHeader
        title="Dispatches"
        subtitle="Manage and track dispatch orders."
        action="Add Dispatch"
      />
      <div className="w-full">
        <DataTable data={sampleOrders} columns={columns} />
      </div>
    </div>
  );
};

export default DispatchesPage;
