import PageHeader from "@/components/page-header";
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
        {/* <DataTable data={sampleOrders} columns={columns} /> */}
      </div>
    </div>
  );
};

export default DispatchesPage;
