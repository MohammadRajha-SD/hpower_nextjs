import ResetPassword from "@/components/auth/reset-password/ResetPassword";
import React from "react";

interface ResetPasswordPageProps {
  params: { token: string };
  searchParams: { email?: string };
}

const page = ({ params, searchParams }: ResetPasswordPageProps) => {
  const token = params.token;
  const email = searchParams.email;

  return (
    <div className="w-full mx-auto px-4 py-8 md:py-16 lg:py-24 xxl:px-48">
      <ResetPassword token={token} email={email} />
    </div>
  );
};

export default page;
