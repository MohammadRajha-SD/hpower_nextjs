import { useTranslations } from "next-intl";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "react-phone-input-2/lib/style.css";
import {
    FaCheck,
    FaArrowLeft,
    FaSpinner,
} from "react-icons/fa";

const formVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: "-100%", transition: { duration: 0.3 } },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AgreementESignture = ({
    register,
    onPrev,
    formValues,
    setValue,
    isSubmitting,
    isSuccess,
    errors,
}) => {
    const t = useTranslations("eSignture");
    const tF = useTranslations("FinalStep");

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [hasDrawn, setHasDrawn] = useState(false);

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (canvas && container) {
            const ratio = window.devicePixelRatio || 1;
            const width = container.offsetWidth - 25;
            const height = 300;

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            canvas.width = width * ratio;
            canvas.height = height * ratio;

            const context = canvas.getContext("2d");
            if (context) {
                context.scale(ratio, ratio);
                context.lineCap = "round";
                context.lineJoin = "round";
                context.strokeStyle = "#111";
                context.lineWidth = 2;
                setCtx(context);
            }
        }
    };

    useEffect(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    const getPos = (e: PointerEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const draw = (e: PointerEvent) => {
        if (!isDrawing || !ctx) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        if (!hasDrawn) setHasDrawn(true); 
    };


    const handlePointerDown = (e: PointerEvent) => {
        if (!ctx) return;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setIsDrawing(true);
    };

    const handlePointerUp = () => {
        setIsDrawing(false);
        ctx?.closePath();
        // saveSignature();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.addEventListener("pointerdown", handlePointerDown);
        canvas.addEventListener("pointermove", draw);
        window.addEventListener("pointerup", handlePointerUp);

        return () => {
            canvas.removeEventListener("pointerdown", handlePointerDown);
            canvas.removeEventListener("pointermove", draw);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [ctx, isDrawing]);

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setHasDrawn(false);
        setValue("eSignture", "", { shouldValidate: true });
    };


    const saveSignature = () => {
        if (!hasDrawn) {
            setValue("eSignture", "", { shouldValidate: true });
            return;
        }

        const canvas = canvasRef.current;
        if (canvas) {
            const dataUrl = canvas.toDataURL("image/png");
            setValue("eSignture", dataUrl, { shouldValidate: true });
        }
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(new Date());

    return (
        <motion.div
            key="step2"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
        >
            {/* <motion.div
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-gray-200"
            >
                <h2 className="text-2xl font-bold  mb-4 " style={{ color: '#FF7C44' }}>
                    {t("title1")}
                </h2>
                <p className="text-gray-700 mb-2 leading-relaxed">
                    {t("paragraph1")}
                </p>
                <p className="text-gray-700 leading-relaxed">
                    {t("paragraph2")}
                </p>
            </motion.div> */}

            <motion.div variants={fadeInUp}
                className="p-6 md:p-8 bg-white rounded-2xl shadow-md border border-gray-200 text-gray-700 text-base"
            >
                <div
                    ref={containerRef}
                >
                    <h3 className="font-medium text-gray-700 mb-2">{t("signature")}</h3>
                    <canvas
                        ref={canvasRef}
                        className={`border rounded w-full block touch-none ${errors.eSignture ? "border-red-500" : "border-gray-300"
                            }`}
                    />

                    <div className="mt-2 flex  gap-4">
                        <button
                            type="button"
                            onClick={clearSignature}
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                        >
                            {t("clear")}
                        </button>
                        <button
                            type="button"
                            onClick={saveSignature}
                            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                        >
                            {t("save")}
                        </button>
                    </div>

                    {/* Hidden input for form */}
                    <input type="hidden" {...register("eSignture", { required: true })} />
                    {errors.eSignture && (
                        <p className="text-red-500 text-sm mt-2">{t("signatureRequired")}</p>
                    )}
                </div>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={fadeInUp} className="flex justify-between mt-8">
                <button
                    type="button"
                    onClick={onPrev}
                    className="px-6 py-3 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                    <FaArrowLeft className="h-5 w-5" />
                    <span>{tF("previous")}</span>
                </button>

                {isSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg flex items-center gap-2"
                    >
                        <FaCheck className="h-5 w-5 mr-2" />
                        <span>{tF("applicationSubmitted")}</span>
                    </motion.div>
                ) : (
                    <button
                        type="submit"
                        disabled={
                            isSubmitting || !!errors.eSignture
                        }
                        className={`px-6 py-3 bg-interactive_color text-white rounded-lg flex items-center gap-2 ${isSubmitting || !!errors.eSignture
                            ? "opacity-70 cursor-not-allowed"
                            : "hover:bg-opacity-90"
                            } transition duration-200`}
                    >
                        {isSubmitting ? (
                            <>
                                <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                                <span>{tF("submitting")}</span>
                            </>
                        ) : (
                            <span>{t("submit")}</span>
                        )}
                    </button>
                )}
            </motion.div>
        </motion.div>
    );
};

export default AgreementESignture;
