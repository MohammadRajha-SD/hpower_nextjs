import React from "react";
import AgreementPage from "@/components/partners/AgreementPage";

const Page = ({ params }: { params: { uid: string } }) => {
  return (
    <div>
      <AgreementPage uid={params.uid} />
    </div>
  );
};

export default Page;
