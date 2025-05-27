import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import StepNavigation from "./StepNavigation";
import { FaKey } from "react-icons/fa";
import FormField from "./FormField";

const formVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: "-100%", transition: { duration: 0.3 } },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const EmailVerificationStep = ({
    register,
    errors,
    onNext,
    isNextDisabled,
    onPrev,
    handleSendCode,
    verifyCode,
    isSending,
    sendSuccess,
    watch,
    isCodeValid,
}) => {
    const t1 = useTranslations("Confirmations");
    const codeValue = watch("code");

    const [timer, setTimer] = useState(0);

    const handleClick = () => {
        if (timer === 0) {
            handleSendCode();
            setTimer(30);
        }
    };

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);
    return (
        <motion.div
            key="step2"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
        >
            <motion.div variants={fadeInUp} className="mb-6">
                <div className="text-lg font-semibold text-gray-700 mb-4 flex items-center justify-center">
                    <FaEnvelope className="mr-2 text-interactive_color" />
                    {t1("confirmationMessage")}
                </div>

                <div className="flex flex-col items-center space-y-4">
                    <div className="w-full max-w-md">
                        <FormField
                            label={t1("code")}
                            icon={FaKey}
                            register={register}
                            name="code"
                            errors={errors}
                            placeholder={t1("enterCode")}
                            required={true}
                        />
                    </div>

                    <div className="w-full max-w-md flex justify-between items-center">
                        <button
                            type="button"
                            onClick={handleClick}
                            disabled={timer > 0}
                            className={`text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0 ${timer > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSending
                                ? t1("sending")
                                : sendSuccess
                                    ? `${t1("resendCode")} ${timer > 0 ? `(${timer})` : ""}`
                                    : `${t1("sendVerificationCode")} ${timer > 0 ? `(${timer})` : ""}`
                            }
                        </button>
                    </div>
                </div>
            </motion.div>

            <StepNavigation
                step={4}
                onNext={isCodeValid ? onNext : () => verifyCode(codeValue)}
                onPrev={onPrev}
                isNextDisabled={isNextDisabled}
            />
        </motion.div>
    );
};

export default EmailVerificationStep;
