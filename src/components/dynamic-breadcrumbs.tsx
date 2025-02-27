"use client";

import { usePathname } from "next/navigation";
// import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  // BreadcrumbPage,
} from "@/components/ui/breadcrumb"; // Adjust the import path if necessary
import Link from "next/link";

const DynamicBreadcrumb = () => {
  const pathname = usePathname(); // Get current path
  const pathSegments = pathname.split("/").filter(Boolean); // Split path into segments

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem> */}

        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const isLast = index === pathSegments.length - 1;

          return (
            <div key={href} className="flex items-center space-x-3">
              {index !== 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className="capitalize">
                {isLast ? (
                  <div>
                    {/* <BreadcrumbPage> */}
                    {decodeURIComponent(segment)}
                    {/* </BreadcrumbPage> */}
                  </div>
                ) : (
                  <BreadcrumbLink>
                    <Link href={href}>{decodeURIComponent(segment)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
