import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";

const Loading = () => {
  return (
    <div className="fixex min-h-dvh">
      <div className="h-12 border-b flex items-center">
        <div className="container flex justify-between items-center">
          <div className="dark:text-white text-xl font-bold">
            OPTION <span className="text-red-600">DESK</span>{" "}
          </div>
          <Skeleton className="h-6 w-36" />
        </div>
      </div>
      <div className="grid grid-cols-3 p-4 items-start">
        <div>
          <Card className="p-2">
            <Skeleton className="h-96" />
          </Card>
          <Card className="p-2">
            <Skeleton className="h-96" />
          </Card>
        </div>
        <div className="col-span-2 grid grid-cols-2 items-start">
          <Card className="p-2">
            <Skeleton className="h-72" />
          </Card>
          <Card className="p-2">
            <Skeleton className="h-72" />
          </Card>
          <Card className="p-2">
            <Skeleton className="h-72" />
          </Card>
          <Card className="p-2">
            <Skeleton className="h-72" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Loading;
