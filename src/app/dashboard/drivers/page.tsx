import sampleOrders from "@/app/const/data";
import PageHeader from "@/components/page-header";
import { columns } from "@/components/table/columns/order";
import { DataTable } from "@/components/table/data-table";
import React from "react";

const DriversPage = () => {
  return (
    <div>
      <PageHeader
        title="Drivers"
        subtitle="Manage and track drivers."
        action="Add Driver"
      />
      <div className="w-full">
        <DataTable data={sampleOrders} columns={columns} />
      </div>
    </div>
  );
};

export default DriversPage;
