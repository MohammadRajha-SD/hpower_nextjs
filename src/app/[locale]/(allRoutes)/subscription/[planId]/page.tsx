import React from "react";
import Subscribe from "./Subscribe";

const page = ({ params }: { params: { planId: string } }) => {
  const id = params.planId;

  return (
    <div className="w-full mx-auto px-4 py-8 md:py-16 lg:py-24">
      <Subscribe id={id} />
    </div>
  );
};

export default page;
