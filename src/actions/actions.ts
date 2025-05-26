"use server";

import { cookies } from "next/headers";

export const checkCoupon = async (formData: FormData) => {
  const token = cookies().get("authToken")?.value;
  if (!token) {
    return { error: "Authentication required" };
  }

  try {
    const couponCode = formData.get("code");
    const serviceId = formData.get("service_id");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/check-coupon`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: couponCode,
          service_id: serviceId,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Invalid coupon" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Coupon check error:", error);
    return { error: "Something went wrong." };
  }
};
