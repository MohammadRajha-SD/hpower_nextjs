"use client";
import "swiper/css";
import AgreementForm from "./AgreementForm";
import { useAgreement } from "@/hooks/useAgreement";

const AgreementPage = ({ uid }: { uid: string }) => {
    const { agreement } = useAgreement(uid);

    if (!agreement) return <div>Loading...</div>;

    return (
        <div className="w-full py-10 my-5">
            <div className="container mx-auto p-4 max-w-7xl relative overflow-hidden">
                <AgreementForm agreement={agreement} />
            </div>
        </div>
    );
};

export default AgreementPage;
