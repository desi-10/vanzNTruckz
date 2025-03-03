"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Driver } from "@prisma/client";

const DriverKycDetails = ({ data }: { data: Driver }) => {
  console.log(data, "data");

  const { data: driver } = useQuery({
    queryKey: ["driver-kyc-details", data?.userId],
    queryFn: async () => {
      const res = await axios.get(`/api/v1/drivers/${data?.userId}`);
      return res.data;
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View KYC Details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Driver KYC Details</DialogTitle>
          <DialogDescription>
            View all KYC details of the driver before approving.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {driver && (
            <>
              <Input value={driver.license || "N/A"} readOnly />
              <Input value={driver.vehicleType || "N/A"} readOnly />
              <Input value={driver.isActive ? "Yes" : "No"} readOnly />
              <Input value={driver.numberPlate || "N/A"} readOnly />
              <Input
                value={
                  driver.licenseExpiry
                    ? new Date(driver.licenseExpiry).toLocaleDateString()
                    : "N/A"
                }
                readOnly
              />
              <Input value={driver.roadworthySticker || "N/A"} readOnly />
              <Input
                value={
                  driver.roadworthyExpiry
                    ? new Date(driver.roadworthyExpiry).toLocaleDateString()
                    : "N/A"
                }
                readOnly
              />
              <Input value={driver.insuranceSticker || "N/A"} readOnly />
              <Input value={driver.ghanaCard || "N/A"} readOnly />
              <Input value={driver.kycStatus || "N/A"} readOnly />
            </>
          )}
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline">Cancel</Button>
          <Button variant="default">Approve</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DriverKycDetails;
