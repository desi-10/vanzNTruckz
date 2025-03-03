"use client";
import PageHeader from "@/components/page-header";
import ServerError from "@/components/server-error";
import TableLoader from "@/components/table-loader";
import { columns } from "@/components/table/columns/drivers";
import { DataTable } from "@/components/table/data-table";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const fetchDrivers = async () => {
  const response = await fetch("/api/v1/drivers");
  const data = await response.json();
  return data;
};

const DriversPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["drivers"],
    queryFn: fetchDrivers,
  });

  if (isError) {
    return <ServerError />;
  }

  return (
    <div>
      <PageHeader
        title="Drivers"
        subtitle="Manage and track drivers."
        action="Add Driver"
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

export default DriversPage;
