"use client";
import PageHeader from "@/components/page-header";

const SingleOrder = () => {
  return (
    <div>
      <PageHeader
        title="Order Details"
        subtitle="View and manage order details."
        action="Edit Order"
      />

      <div className="p-6 space-y-4"></div>
    </div>
  );
};

export default SingleOrder;
