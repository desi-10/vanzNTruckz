"use client";
import PageHeader from "@/components/page-header";
import TableLoader from "@/components/table-loader";
import { columns } from "@/components/table/columns/customers";
import { DataTable } from "@/components/table/data-table";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const fetchCustomers = async () => {
  const response = await fetch("/api/v1/customers");
  const data = await response.json();
  return data;
};

const CustomersPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Manage and track customers."
        action="Add Customer"
      />
      {isLoading ? (
        <TableLoader />
      ) : (
        <div className="w-full">
          <DataTable data={data} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
