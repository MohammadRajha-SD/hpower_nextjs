import React from "react";
import AgreementPageDetails from "@/components/partners/AgreementPageDetails";

const Page = ({ params }: { params: { uid: string } }) => {
  return (
    <div>
      <AgreementPageDetails uid={params.uid} />
    </div>
  );
};

export default Page;
