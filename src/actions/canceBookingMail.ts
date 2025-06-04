"use server";

import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "mail.hpower.ae",
  port: parseInt(process.env.MAIL_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME || "noreply@hpower.ae",
    pass: process.env.MAIL_PASSWORD || "hpower@200",
  },
  tls: {
    rejectUnauthorized: false, // Bypass self-signed certificate verification
  },
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter verification failed:", error);
  } else {
    console.log("Transporter is ready to send emails");
  }
});

interface CancellationData {
  serviceName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  providerEmail: string;
  providerName: string;
  providerPhone: string; // Added providerPhone
  reason: string;
  locale?: string;
}

const cancellationEmailTemplate = (data: CancellationData, locale: string) => {
  const isArabic = locale === "ar";
  const translations = {
    subject: isArabic
      ? `إلغاء خدمة: ${data.serviceName}`
      : `Service Cancellation: ${data.serviceName}`,
    header: isArabic ? "إلغاء الخدمة" : "Service Cancellation",
    intro: isArabic
      ? `تم تقديم طلب إلغاء الخدمة التالية: <span style="color: #1a5276;">${data.serviceName}</span>`
      : `A cancellation request has been submitted for the following service: <span style="color: #1a5276;">${data.serviceName}</span>`,
    detailsHeader: isArabic ? "تفاصيل الإلغاء" : "Cancellation Details",
    labels: {
      serviceName: isArabic ? "اسم الخدمة" : "Service Name",
      userName: isArabic ? "اسم العميل" : "User Name",
      userEmail: isArabic ? "البريد الإلكتروني" : "User Email",
      userPhone: isArabic ? "رقم هاتف العميل" : "User Phone",
      providerName: isArabic ? "اسم المزود" : "Provider Name",
      providerPhone: isArabic ? "رقم هاتف المزود" : "Provider Phone", // Added providerPhone label
      reason: isArabic ? "سبب الإلغاء" : "Reason for Cancellation",
    },
    footer: isArabic
      ? "2025 HPower. جميع الحقوق محفوظة."
      : "2025 HPower. All rights reserved.",
  };

  const html = `
    <div style="font-family: ${isArabic ? "'Tajawal', sans-serif" : "'Poppins', sans-serif"}; background-color: #f8fafc; margin: 0; padding: 20px; line-height: 1.7; direction: ${isArabic ? "rtl" : "ltr"}; color: #333;">
      <table role="presentation" width="100%" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
        <tr>
          <td style="background: linear-gradient(135deg, #4D002e 0%, #FF7C44 100%); color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">${translations.header}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <p style="margin: 0 0 20px; font-size: 16px;">${translations.intro}</p>
            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px;">
              <h3 style="color: #4D002e; margin: 0 0 15px; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">${translations.detailsHeader}</h3>
              <table role="presentation" style="width: 100%; font-size: 14px;">
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.serviceName}:</strong> ${data.serviceName}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.userName}:</strong> ${data.userName}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.userEmail}:</strong> ${data.userEmail}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.userPhone}:</strong> ${data.userPhone ? `+971 ${data.userPhone}` : "—"}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.providerName}:</strong> ${data.providerName}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.providerPhone}:</strong> ${data.providerPhone ? `+971 ${data.providerPhone}` : "—"}</td></tr>
                <tr><td style="padding: 10px 0;"><strong>${translations.labels.reason}:</strong><br><p style="margin: 10px 0; padding: 10px; background: #e2e8f0; border-radius: 6px; color: #FF7C44;">${data.reason || "—"}</p></td></tr>
              </table>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #FF7C44;">
            <p style="margin: 0;">${translations.footer}</p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const text = `
${translations.subject}:

${translations.labels.serviceName}: ${data.serviceName}
${translations.labels.userName}: ${data.userName}
${translations.labels.userEmail}: ${data.userEmail}
${translations.labels.userPhone}: ${data.userPhone ? `+971 ${data.userPhone}` : "—"}
${translations.labels.providerName}: ${data.providerName}
${translations.labels.providerPhone}: ${data.providerPhone ? `+971 ${data.providerPhone}` : "—"}
${translations.labels.reason}:
${data.reason || "—"}
  `;

  return {
    subject: translations.subject,
    html,
    text,
  };
};

export async function sendCancellationEmail(data: CancellationData) {
  try {
    if (!data.serviceName || !data.userEmail || !data.providerEmail) {
      return {
        success: false,
        error: "Required fields are missing",
      };
    }

    await transporter.sendMail({
      from: process.env.MAIL_FROM || "noreply@hpower.ae",
      to: process.env.MAIL_ADMIN || "noreply@hpower.ae",
      cc: data.providerEmail,
      ...cancellationEmailTemplate(data, data.locale || "en"),
    });

    return {
      success: true,
      message: "Cancellation email sent successfully",
    };
  } catch (error: any) {
    console.error("Error sending cancellation email:", error.message);
    return {
      success: false,
      error: `Failed to send cancellation email: ${error.message}`,
    };
  }
}
