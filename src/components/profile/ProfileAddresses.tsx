import { useState } from "react";
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
import { useLocale, useTranslations } from "next-intl";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
export default function ProfileAddresses({ user }) {
    const [apartmentName, setApartmentName] = useState("");
    const [buildingNumber, setBuildingNumber] = useState("");
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpenId, setDeleteOpenId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState(null);
    const locale = useLocale();
    const [editMode, setEditMode] = useState(false);
    const [editAddressId, setEditAddressId] = useState<number | null>(null);

    const t = useTranslations("profile");
    const t2 = useTranslations("SingleService");
    const getAuthToken = () => Cookies.get("authToken") || "";

    const handleAddAddress = async () => {
        setIsLoading(true);

        const updateData = {
            address: address,
            apartment_name: apartmentName,
            building_number: buildingNumber,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/add-address`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify(updateData),
            });

            const result = await response.json();

            if (result.status) {
                toast.success(locale == "ar" ? result.message_ar : result.message_en);
                setAddOpen(false);

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.error("Something went wrong.");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAddress = async (addressId: number) => {
        setIsLoading(true);

        const deleteData = {
            addressId: addressId,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/delete-address/${addressId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify(deleteData),
            });

            const result = await response.json();

            if (result.status) {
                toast.success(locale == "ar" ? result.message_ar : result.message_en);

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.error(locale == "ar" ? result.message_ar : result.message_en);
            }
        } catch (error) {
            toast.error("Error deleting address.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditAddress = async () => {
        if (!editAddressId) return;

        setIsLoading(true);

        const updateData = {
            id: editAddressId,
            address: address,
            apartment_name: apartmentName,
            building_number: buildingNumber,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile/edit-address`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify(updateData),
            });

            const result = await response.json();

            if (result.status) {
                toast.success(locale === "ar" ? result.message_ar : result.message_en);
                setAddOpen(false);
                setTimeout(() => window.location.reload(), 2000);
            } else {
                toast.error(locale === "ar" ? result.message_ar : result.message_en || "Something went wrong.");
            }
        } catch (error) {
            toast.error(locale === "ar" ? "خطأ في الاتصال بالشبكة" : "Network error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* delete dialog */}
            <AlertDialog open={deleteOpenId != null} onOpenChange={() => setDeleteOpenId(null)}>
                <AlertDialogContent className="bg-white max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-gray-800" dir="auto">
                            {t("confirm_deletion")}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600" dir="auto">
                            {t("delete_address_warning")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="gap-2 mt-4">
                        <AlertDialogCancel className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                            {t("cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDeleteAddress(deleteOpenId)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            {isLoading ? t("deleting") : t("confirm_delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* add dialog */}
            <AlertDialog open={addOpen} onOpenChange={setAddOpen}>
                <AlertDialogContent className="max-w-md bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("add_new_address")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("enter_address_details")}</AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t2("address")}
                        </label>
                        <textarea
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder={t2("enter_your_address_placeholder")}
                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-interactive_color"}`}
                            rows={3}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("apartment_name")}
                            </label>
                            <input
                                type="text"
                                value={apartmentName}
                                onChange={(e) => setApartmentName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("building_number")}
                            </label>
                            <input
                                type="text"
                                value={buildingNumber}
                                onChange={(e) => setBuildingNumber(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isLoading || !address || !buildingNumber || !apartmentName}
                            onClick={handleAddAddress}
                            className="bg-interactive_color text-white rounded px-4 py-2 hover:bg-active_color"
                        >
                            {isLoading ? t("adding") : t("add")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* edit dialog */}
            <AlertDialog open={editMode} onOpenChange={setEditMode}>
                <AlertDialogContent className="max-w-md bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("edit_address")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("update_address_details")}</AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t2("address")}
                        </label>
                        <textarea
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder={t2("edit_your_address_placeholder")}
                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 hover:border-interactive_color`}
                            rows={3}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("apartment_name")}
                            </label>
                            <input
                                type="text"
                                value={apartmentName}
                                onChange={(e) => setApartmentName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("building_number")}
                            </label>
                            <input
                                type="text"
                                value={buildingNumber}
                                onChange={(e) => setBuildingNumber(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isLoading || !address || !buildingNumber || !apartmentName}
                            onClick={handleEditAddress}
                            className="bg-interactive_color text-white rounded px-4 py-2 hover:bg-active_color"
                        >
                            {isLoading ? t("updating") : t("update")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Addresses start */}
            <div className="flex gap-2 mt-2 items-start justify-between">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-2 flex items-center gap-2">
                    <span className="w-1 h-6 bg-interactive_color rounded-full mr-2"></span>
                    {t("saved_addresses")}
                </h2>

                <motion.button
                    className="flex items-center justify-center gap-2  px-5 py-2.5 bg-interactive_color hover:bg-active_color text-white rounded-lg shadow-md transition-all duration-300 ease-in-out font-medium"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setAddOpen(true)}
                >
                    {t("add_address")}
                </motion.button>
            </div >

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-2">
                {user?.addresses && user?.addresses?.length > 0 ? (
                    user?.addresses
                        ?.slice()
                        .sort((a, b) => b.id - a.id)
                        .map((address: any, index: number) => (
                            <div
                                key={index}
                                className="relative p-4 border rounded-lg flex flex-col w-full border-gray-200 bg-white shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-200"
                            >
                                <span className="font-medium mb-3 text-lg text-gray-800">
                                    {address.address}
                                </span>
                                <span className="text-sm text-gray-700">
                                    {address.apartment_name && (
                                        <div>
                                            <strong>{t("apartment_name")}:</strong> {address.apartment_name}
                                        </div>
                                    )}
                                    {address.building_number && (
                                        <div>
                                            <strong>{t("building_number")}:</strong> {address.building_number}
                                        </div>
                                    )}
                                </span>

                                <div className="flex gap-2 mt-2 items-start justify-between">
                                    <div className="text-sm text-gray-600">
                                        {t("created_at")}: {new Date(address.created_at).toLocaleDateString()}
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => {
                                                setEditMode(true);
                                                setEditAddressId(address.id);
                                                setAddress(address.address);
                                                setApartmentName(address.apartment_name);
                                                setBuildingNumber(address.building_number);
                                            }}
                                            className="text-green-600 hover:text-green-800 text-sm"
                                        >
                                            {t("edit")}
                                        </button>


                                        <button
                                            onClick={() => setDeleteOpenId(address.id)}
                                            className="text-red-600 hover:text-red-800 ml-2 text-sm"
                                        >
                                            {t("delete")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="col-span-full p-6 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mx-auto text-gray-400 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-gray-600 font-medium">
                            {t("no_addresses_found")}
                        </p>
                    </motion.div>
                )}
            </div>
            {/* Addresses end */}
        </>
    );
}
