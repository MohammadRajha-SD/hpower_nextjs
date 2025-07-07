import React, { useState, useEffect, useRef } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import { ChevronDownIcon, XIcon, CheckIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useServices } from "@/hooks/useServices";
import useUserDetails from "@/hooks/useUserDetails";
import Cookies from "js-cookie";

interface LocationSelectorProps {
    emirates: Record<string, { name: string; slug: string }[]>;
    onSelect: (emirateSlug: string, cityName?: string) => void;
    onClose: () => void;
    selectedEmirate: string | null;
}

const LocationSelector = ({
    emirates,
    onSelect,
    onClose,
    selectedEmirate,
}: LocationSelectorProps) => {
    const t = useTranslations("LocationSelector");
    const [expandedEmirate, setExpandedEmirate] = useState<string | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Toggle emirate expand/collapse
    const toggleEmirate = (emirate: string) => {
        setExpandedEmirate(expandedEmirate === emirate ? null : emirate);
    };

    // City select handler
    const handleCitySelect = (
        emirate: string,
        city: { name: string; slug: string }
    ) => {
        onSelect(city.slug, city.name);
    };

    // Filter emirates by search term
    const filteredEmirates = Object.keys(emirates).filter((emirate) => {
        if (!searchTerm) return true;
        if (emirate.toLowerCase().includes(searchTerm.toLowerCase())) return true;
        return emirates[emirate].some((city) =>
            city.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });


    return (
        <motion.div
            ref={dropdownRef}
            className="w-full max-w-full bg-white rounded-lg shadow-xl  overflow-auto z-[1000]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
        >
            <div className="sticky top-0 bg-white p-4 border-b z-20">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">{t("select_location_title")}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label={t("close")}
                    >
                        <XIcon className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t("search_placeholder")}
                    className="w-full p-2 pl-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-interactive_color"
                />
            </div>

            <div className="p-2">
                {filteredEmirates.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        {t("no_locations_found", { searchTerm })}
                    </div>
                ) : (
                    filteredEmirates.map((emirate) => {
                        const filteredCities = searchTerm
                            ? emirates[emirate].filter((city) =>
                                city.name.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            : emirates[emirate];

                        if (searchTerm && filteredCities.length === 0) return null;

                        return (
                            <div key={emirate} className="mb-1">
                                <div
                                    onClick={() => toggleEmirate(emirate)}
                                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    <span className="font-medium">{emirate}</span>
                                    <ChevronDownIcon
                                        className={`h-4 w-4 transition-transform duration-300 ${expandedEmirate === emirate ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>

                                {expandedEmirate === emirate && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="ml-4 border-l-2 border-gray-200 pl-2 mt-1 mb-2"
                                    >
                                        {filteredCities.map((city) => (
                                            <div
                                                key={city.slug}
                                                onClick={() => handleCitySelect(emirate, city)}
                                                className={`p-2 flex items-center justify-between cursor-pointer hover:bg-gray-100 rounded-md transition-colors ${selectedEmirate === city.slug
                                                    ? "bg-blue-50 text-interactive_color"
                                                    : ""
                                                    }`}
                                            >
                                                <span>{city.name}</span>
                                                {selectedEmirate === city.slug && (
                                                    <CheckIcon className="h-4 w-4 text-interactive_color" />
                                                )}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {searchTerm && (
                <div className="sticky bottom-0 bg-white p-3 border-t">
                    <button
                        onClick={() => setSearchTerm("")}
                        className="w-full py-2 text-center text-sm text-interactive_color hover:underline"
                        aria-label={t("clear_search")}
                    >
                        {t("clear_search")}
                    </button>
                </div>
            )}
        </motion.div>
    );
};

const AddressPromptDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEmirate, setSelectedEmirate] = useState<string | null>(null);
    const t = useTranslations("AddressPrompt");
    const { emirates } = useServices();
    const { user, setUser, userType } = useUserDetails();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (user && !user.address) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [user]);

    function handleLocationSelect(emirateSlug: string) {
        setSelectedEmirate(emirateSlug);
    }

    async function handleSave() {
        if (!selectedEmirate) return;

        try {
            const token = Cookies.get("authToken");
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

            const response = await fetch(`${baseUrl}/user/address`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address: selectedEmirate }),
            });

            if (!response.ok) {
                throw new Error('Failed to update address');
            }

            const updatedUser = await response.json();

            setIsOpen(false);
        } catch (error) {
            console.error('Error updating address:', error);
        }
    }

    function handleClose() {
        if (user?.address) {
            setIsOpen(false);
        }
    }

    if (!user || userType != 'user') return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={handleClose}>
            <AlertDialogContent className="bg-white max-w-3xl rounded-xl shadow-2xl w-md-[90%] max-h-[90vh] overflow-y-auto">
                <AlertDialogHeader className="p-6 bg-interactive_color text-white hover:bg-active_color rounded-t-xl">
                    <AlertDialogTitle className="text-2xl font-bold text-center">
                        {t("pleaseSelectAddress")}
                    </AlertDialogTitle>
                    <p className="mt-1 text-sm opacity-90 text-center">
                        {t("youNeedToSelectAddress")}
                    </p>
                </AlertDialogHeader>

                <div className="relative w-full">
                    <button
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        className="w-full border border-gray-300 p-3 rounded-lg text-left"
                    >
                        {selectedEmirate ? selectedEmirate : t("select_location_title")}
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute mt-2 w-full z-50">
                            <LocationSelector
                                emirates={emirates?.emirates || {}}
                                onSelect={(slug, name) => {
                                    handleLocationSelect(slug);
                                    setIsDropdownOpen(false);
                                }}
                                onClose={() => setIsDropdownOpen(false)}
                                selectedEmirate={selectedEmirate}
                            />
                        </div>
                    )}
                </div>

                {/* <div className="flex flex-col items-center justify-center space-y-6 p-6 w-full">
                    <LocationSelector
                        emirates={emirates?.emirates || {}}
                        onSelect={handleLocationSelect}
                        onClose={() => setIsOpen(false)}
                        selectedEmirate={selectedEmirate}
                    />
                </div> */}

                <AlertDialogFooter className="p-6 bg-gray-50 rounded-b-xl border-t border-gray-200 flex gap-3 items-center justify-end">
                    <AlertDialogCancel
                        onClick={() => setIsOpen(false)}
                        className="bg-gray-100 text-interactive_color hover:bg-gray-300 hover:text-gray-900 transition-colors border border-interactive_color"
                    >
                        {t("cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSave}
                        disabled={!selectedEmirate}
                        className={`bg-interactive_color disabled:bg-[#5c4255] text-white disabled:cursor-not-allowed hover:bg-active_color transition-colors ${!selectedEmirate ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {t("save")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AddressPromptDialog;