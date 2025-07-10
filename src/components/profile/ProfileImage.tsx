import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function ProfileImage({ user, handleUpdateProfileImage }) {
    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const fileInputRef = useRef(null);
    const t = useTranslations("profile");
    const t2 = useTranslations("editProfile");

    const getAuthToken = () => Cookies.get("authToken") || "";

    const handleImageClick = () => setShowModal(true);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!selectedImage) return;

        setIsUpdating(true);

        const formData = new FormData();

        formData.append("image", selectedImage);
        formData.append("userId", user?.id);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/upload-profile-image`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const result = await response.json();

            handleUpdateProfileImage(result.data);

            setShowModal(false);

            setTimeout(() => {
                window.location.reload();
            }, 2000);

            toast.success(t2("update_success"));
        } catch (error) {
            console.error("Upload Error:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative group cursor-pointer"
                onClick={handleImageClick}
            >
                {/* || "/user.png" */}
                {user?.image_path &&
                    <img
                        src={user?.image_path}
                        alt={t("profile_picture_alt")}
                        className="rounded-full w-40 h-40 object-cover border-4 border-intebg-interactive_color shadow-md"
                    />
                }
                <div className="absolute inset-0 bg-interactive_color bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Edit className="w-8 h-8 text-white" />
                </div>
            </motion.div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            {t("update_profile_image")}
                        </h2>

                        {preview ? (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="relative group  rounded-full flex items-center justify-center text-gray-400"
                            >
                                <img
                                    src={preview}
                                    alt={t("preview")}
                                    className="rounded-full w-40 h-40 object-cover border-4 border-intebg-interactive_color shadow-md"
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="relative group  rounded-full flex items-center justify-center text-gray-400"
                            >
                                <img
                                    src={user?.image_path || "/user.png"}
                                    alt={t("profile_picture_alt")}
                                    className="rounded-full w-40 h-40 object-cover border-4 border-intebg-interactive_color shadow-md"
                                />
                            </motion.div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        <button
                            className="text-gray-700 underline px-4 py-2 rounded w-full mb-3"
                            onClick={() => fileInputRef.current.click()}
                        >
                            {t("choose_image")}
                        </button>

                        <div className="flex justify-end gap-3">
                            <motion.button
                                className="flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-red-500 hover:bg-active_color text-white rounded-lg shadow-md transition-all duration-300 ease-in-out font-medium"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setShowModal(false)}
                            >
                                {t("cancel")}
                            </motion.button>

                            <motion.button
                                className={`flex items-center justify-center gap-2 w-full px-5 py-2.5 ${isUpdating
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-interactive_color hover:bg-active_color"
                                    } text-white rounded-lg shadow-md transition-all duration-300 ease-in-out font-medium`}
                                whileHover={{ scale: isUpdating ? 1 : 1.03 }}
                                whileTap={{ scale: isUpdating ? 1 : 0.97 }}
                                onClick={handleSave}
                                disabled={!selectedImage || isUpdating}
                            >
                                {isUpdating ? t("updating") : t("save")}
                            </motion.button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
