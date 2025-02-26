import PageHeader from "@/components/page-header";
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
        {/* <DataTable data={sampleOrders} columns={columns} /> */}
      </div>
    </div>
  );
};

export default DriversPage;
