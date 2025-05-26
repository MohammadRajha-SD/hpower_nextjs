import SingleService from "@/components/services/SingleService";
import React from "react";

const page = ({ params }: { params: { serviceId: string } }) => {
  const id = params.serviceId;
  return (
    <div className="w-full mx-auto px-4 py-8 md:py-16 lg:py-24">
      <SingleService serviceId={id}/>
    </div>
  );
};

export default page;
