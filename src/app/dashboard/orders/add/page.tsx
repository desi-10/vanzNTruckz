"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "@/components/page-header";
import { PaginatedCombobox } from "@/components/combobox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import { useRouter } from "next/navigation";

export default function CreateOrder() {
  const { register } = useForm();
  const [selectedCustomer, setSelectedCustomer] = useState("");

  console.log(selectedCustomer);

  //   const router = useRouter();

  return (
    <div>
      {/* <Button variant="link" onClick={() => router.back()} className="mb-5">
        <ArrowLeft />
        <p>Back to orders</p>
      </Button> */}
      <PageHeader
        title="Create Order"
        subtitle="Manage customer orders efficiently."
        action={<Button>Save Order</Button>}
      />
      <form onSubmit={() => {}} className="grid lg:grid-cols-3 gap-10">
        {/* Customer Selection */}
        <div className="col-span-2 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer
            </label>
            <PaginatedCombobox
              items={[
                { id: "customer1", name: "Customer 1" },
                { id: "customer2", name: "Customer 2" },
                { id: "customer3", name: "Customer 3" },
                { id: "customer4", name: "Customer 4" },
                { id: "customer5", name: "Customer 5" },
                { id: "customer6", name: "Customer 6" },
                { id: "customer7", name: "Customer 7" },
                { id: "customer8", name: "Customer 8" },
                { id: "customer9", name: "Customer 9" },
                { id: "customer10", name: "Customer 10" },
                { id: "customer11", name: "Customer 11" },
                { id: "customer12", name: "Customer 12" },
                { id: "customer13", name: "Customer 13" },
                { id: "customer14", name: "Customer 14" },
                { id: "customer15", name: "Customer 15" },
                { id: "customer16", name: "Customer 16" },
                { id: "customer17", name: "Customer 17" },
                { id: "customer18", name: "Customer 18" },
                { id: "customer19", name: "Customer 19" },
                { id: "customer20", name: "Customer 20" },
              ]}
              itemsPerPage={10}
              onSelectedItemChange={(selectedItem) =>
                setSelectedCustomer(selectedItem?.id || "")
              }
              placeholder="Select a customer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Driver
            </label>
            <PaginatedCombobox
              items={[
                { id: "driver1", name: "Driver 1" },
                { id: "driver2", name: "Driver 2" },
                { id: "driver3", name: "Driver 3" },
                { id: "driver4", name: "Driver 4" },
                { id: "driver5", name: "Driver 5" },
                { id: "driver6", name: "Driver 6" },
                { id: "driver7", name: "Driver 7" },
                { id: "driver8", name: "Driver 8" },
                { id: "driver9", name: "Driver 9" },
                { id: "driver10", name: "Driver 10" },
                { id: "driver11", name: "Driver 11" },
                { id: "driver12", name: "Driver 12" },
                { id: "driver13", name: "Driver 13" },
                { id: "driver14", name: "Driver 14" },
                { id: "driver15", name: "Driver 15" },
                { id: "driver16", name: "Driver 16" },
                { id: "driver17", name: "Driver 17" },
                { id: "driver18", name: "Driver 18" },
                { id: "driver19", name: "Driver 19" },
                { id: "driver20", name: "Driver 20" },
              ]}
              itemsPerPage={10}
              onSelectedItemChange={(selectedItem) =>
                setSelectedCustomer(selectedItem?.id || "")
              }
              placeholder="Select a driver"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <Input {...register("price")} type="number" className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Final Price
            </label>
            <Input
              {...register("finalPrice")}
              type="number"
              className="w-full"
            />
          </div>
        </div>

        <div className="col-span-1 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Status
            </label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>
    </div>
  );
}
