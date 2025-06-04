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
    rejectUnauthorized: false,
  },
});

// التحقق من التوصيل
transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter verification failed:", error);
  } else {
    console.log("Email transporter is ready.");
  }
});

interface VerificationEmailData {
  userName: string;
  userEmail: string;
  code: string;
  locale?: string; // "ar" or "en"
}

// قالب الإيميل
const getVerificationEmailTemplate = (
  data: VerificationEmailData,
  locale: string
) => {
  const isArabic = locale === "ar";

  const translations = {
    subject: isArabic ? "رمز التحقق من الحساب" : "Account Verification Code",
    greeting: isArabic ? `مرحباً ${data.userName}،` : `Hello ${data.userName},`,
    body: isArabic
      ? `رمز التحقق الخاص بك هو: <strong>${data.code}</strong>`
      : `Your verification code is: <strong>${data.code}</strong>`,
    footer: isArabic
      ? "إذا لم تطلب رمز التحقق، يرجى تجاهل هذه الرسالة."
      : "If you did not request this code, please ignore this email.",
  };

  const html = `
    <div style="font-family: ${isArabic ? "Tajawal" : "Poppins"}, sans-serif; direction: ${isArabic ? "rtl" : "ltr"}; background-color: #f8f9fa; padding: 20px; color: #333;">
      <div style="max-width: 500px; margin: auto; background-color: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h2 style="color: #4D002e;">${translations.subject}</h2>
        <p>${translations.greeting}</p>
        <p style="font-size: 18px; margin: 20px 0;">${translations.body}</p>
        <p style="font-size: 13px; color: #888;">${translations.footer}</p>
      </div>
    </div>
  `;

  const text = `
${translations.subject}
${translations.greeting}
${translations.body.replace(/<[^>]+>/g, "")}
${translations.footer}
  `;

  return {
    subject: translations.subject,
    html,
    text,
  };
};

// دالة إرسال الإيميل
export async function sendVerificationCodeEmail(data: VerificationEmailData) {
  try {
    if (!data.userEmail || !data.code) {
      return {
        success: false,
        error: "Email and verification code are required.",
      };
    }

    const template = getVerificationEmailTemplate(data, data.locale || "en");

    await transporter.sendMail({
      from: process.env.MAIL_FROM || "noreply@hpower.ae",
      to: data.userEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return {
      success: true,
      message: "Verification code email sent successfully.",
    };
  } catch (error: any) {
    console.error("Error sending verification code email:", error.message);
    return {
      success: false,
      error: `Failed to send verification code: ${error.message}`,
    };
  }
}
