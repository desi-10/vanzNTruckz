"use client";
import { useRouter } from "next/router";
import { Button } from "./ui/button";

const ServerError = () => {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white dark:bg-black flex items-center justify-center z-50">
      <div className="">
        <p className="text-sm -mb-12 text-center font-bold">
          Internal Server Error
        </p>
        <h1 className="text-[200px] font-bold grid  text-center">500</h1>
        <p className="-mt-16 text-red-500 ">
          Oops! Something went wrong on our side. Please try again later.
        </p>
        <div className="flex justify-center mt-5">
          <Button
            onClick={() => router.push("/dashboard/orders")}
            className="bg-primaryColor mx-auto text-white hover:bg-primaryColor/90"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
