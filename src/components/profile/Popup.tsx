"use client";
import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface EditProfileModalProps {
  email: string;
  phoneNumber: string;
  username: string;
  name: string;
  userType: string;
  onUpdateProfile: (data: {
    email?: string;
    phoneNumber?: string;
    username?: string;
    name?: string;
    password?: string;
    userType?: string;
  }) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  email,
  phoneNumber,
  username,
  name,
  userType,
  onUpdateProfile,
}) => {
  const t = useTranslations("editProfile");
  const [newEmail, setNewEmail] = useState(email);
  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber);
  const [newName, setNewName] = useState(name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"contact" | "password">("contact");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // Get auth token
  const getAuthToken = () => Cookies.get("authToken") || "";

  // Update state when props change
  useEffect(() => {
    setNewEmail(email);
    setNewPhoneNumber(phoneNumber);
    setNewName(name);
  }, [email, phoneNumber, username, name]);

  // Reset password fields when dialog opens or closes
  useEffect(() => {
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setActiveTab("contact");
    }
  }, [open]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const updateData: {
      email?: string;
      phone_number?: string;
      username?: string;
      name?: string;
      password?: string;
      current_password?: string;
      user_type?: string;
    } = { user_type: userType }; // Always include user_type

    if (activeTab === "contact") {
      if (newEmail !== email) updateData.email = newEmail;
      if (newPhoneNumber !== phoneNumber)
        updateData.phone_number = newPhoneNumber;
      if (newName !== name) updateData.name = newName;
    } else if (activeTab === "password") {
      if (newPassword && newPassword === confirmPassword) {
        updateData.password = newPassword;
        updateData.current_password = currentPassword;
      } else {
        toast.error(t("passwords_dont_match"));
        setIsLoading(false);
        return;
      }
    }

    // Only send update if there are changes
    if (Object.keys(updateData).length === 1 && updateData.user_type) {
      toast.error(t("no_changes"));
      setIsLoading(false);
      setOpen(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/profile/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message_en || t("update_success"));
      }

      if (result.success) {
        // Fetch the latest user data to ensure consistency
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );

        const userResult = await userResponse.json();

        if (!userResponse.ok) {
          throw new Error(userResult.message_en || t("fetch_user_failed"));
        }

        const updatedUserData = {
          email: userResult.data.email,
          phoneNumber: userResult.data.phone_number,
          username: userResult.data.username,
          name: userResult.data.name,
          userType: userResult.data.user_type,
        };

        onUpdateProfile(updatedUserData);
        toast.success(t("update_success"));
        router.push("/profilee");
        setOpen(false);
      } else {
        throw new Error(t("update_failed"));
      }
    } catch (error: any) {
      toast.success(error.message || t("update_failed"));
      router.prefetch("/profileeee");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <motion.button
          className="flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-interactive_color hover:bg-active_color text-white rounded-lg shadow-md transition-all duration-300 ease-in-out font-medium"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Edit className="h-4 w-4 mr-2" />
          {t("edit_profile")}
        </motion.button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle
            className="text-xl font-bold text-gray-800"
            dir="auto"
          >
            {t("edit_profile")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600" dir="auto">
            {t("update_profile_description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 transition-colors duration-200 ${
              activeTab === "contact"
                ? "border-b-2 border-interactive_color text-interactive_color font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("contact")}
          >
            {t("contact_info")}
          </button>
          <button
            className={`py-2 px-4 transition-colors duration-200 ${
              activeTab === "password"
                ? "border-b-2 border-interactive_color text-interactive_color font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("password")}
          >
            {t("change_password")}
          </button>
        </div>

        {activeTab === "contact" ? (
          <div className="space-y-4 py-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
                dir="auto"
              >
                {t("name_label")}
              </label>
              <input
                type="text"
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-interborder-interactive_color focus:border-interactive_color transition-colors duration-200"
                placeholder={t("name_placeholder")}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
                dir="auto"
              >
                {t("email_label")}
              </label>
              <input
                type="email"
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-interborder-interactive_color focus:border-interactive_color transition-colors duration-200"
                placeholder={t("email_placeholder")}
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
                dir="auto"
              >
                {t("phone_label")}
              </label>
              <input
                type="tel"
                id="phone"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-interborder-interactive_color focus:border-interactive_color transition-colors duration-200"
                placeholder={t("phone_placeholder")}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
                dir="auto"
              >
                {t("current_password_label")}
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-interborder-interactive_color focus:border-interactive_color transition-colors duration-200"
                placeholder={t("current_password_placeholder")}
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
                dir="auto"
              >
                {t("new_password_label")}
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-interborder-interactive_color focus:border-interactive_color transition-colors duration-200"
                placeholder={t("new_password_placeholder")}
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
                dir="auto"
              >
                {t("confirm_password_label")}
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-interborder-interactive_color focus:border-interactive_color transition-colors duration-200"
                placeholder={t("confirm_password_placeholder")}
              />
              {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <p className="text-sm text-red-500 mt-1" dir="auto">
                    {t("passwords_dont_match")}
                  </p>
                )}
            </div>
          </div>
        )}

        <AlertDialogFooter className="gap-2 mt-4">
          <AlertDialogCancel className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 bg-interactive_color text-white rounded-lg hover:bg-active_color transition-colors duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? t("saving") : t("save_changes")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditProfileModal;
