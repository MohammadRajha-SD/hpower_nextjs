import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const useUserDetails = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utility function to safely get the 'en' value or fallback to a default
  const getLocalizedValue = (value, defaultValue = "") => {
    if (!value) return defaultValue;
    if (typeof value === "string") return value; // If it's already a string
    return value.en || defaultValue; // If it's an object, get 'en' or default
  };

  // Function to normalize user data
  const normalizeUserData = (userData, type) => {
    if (!userData) return null;

    return {
      ...userData,
      name: getLocalizedValue(userData.name),
      description: getLocalizedValue(userData.description),
      user_type: type, // Add user_type field for consistency
    };
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);

      try {
        // First check if we have a token
        const token = Cookies.get("authToken");

        if (!token) {
          // If no token, try to get user from cookies as fallback
          const storedUser = Cookies.get("userData");
          const storedUserType = Cookies.get("userType");

          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const normalizedUser = normalizeUserData(
              parsedUser,
              storedUserType
            );
            setUser(normalizedUser);
            setUserType(storedUserType);
          }
          setLoading(false);
          return;
        }

        // Try provider endpoint first
        let userData = null;
        let type = null;

        try {
          // First try provider endpoint
          const providerResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/provider/me`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (providerResponse.ok) {
            const providerResult = await providerResponse.json();
            userData = providerResult.data || providerResult;
            type = "provider";
          }
        } catch (providerErr) {
          console.log("Provider endpoint failed:", providerErr);
        }

        // If provider endpoint failed, try user endpoint
        if (!userData) {
          try {
            const userResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/user/me`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (userResponse.ok) {
              const userResult = await userResponse.json();
              userData = userResult.data || userResult.user;
              type = "user";
            }
          } catch (userErr) {
            console.error("User endpoint failed:", userErr);
          }
        }

        if (!userData) {
          throw new Error("Failed to fetch user details from both endpoints");
        }

        // Normalize the user data before setting it
        const normalizedUser = normalizeUserData(userData, type);

        setUser(normalizedUser);
        setUserType(type);

        // Save to cookies
        Cookies.set("userData", JSON.stringify(normalizedUser), { expires: 7 });
        Cookies.set("userType", type, { expires: 7 });
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(err.message);

        // Try to get user from cookies as fallback
        const storedUser = Cookies.get("userData");
        const storedUserType = Cookies.get("userType");

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            const normalizedUser = normalizeUserData(
              parsedUser,
              storedUserType
            );
            setUser(normalizedUser);
            setUserType(storedUserType);
          } catch (parseErr) {
            console.error("Failed to parse userData cookie:", parseErr);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  return { user, userType, setUser, loading, error };
};

export default useUserDetails;
