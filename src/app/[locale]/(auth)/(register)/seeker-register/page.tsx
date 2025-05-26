"use client";

import SeekerRegisterForm from "@/components/auth/register/SeekerRegisterForm";
import React from "react";

const Register = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <SeekerRegisterForm
        header={"Create account"}
        description={"Create an account to benefit from our services."}
      />
    </div>
  );
};

export default Register;
