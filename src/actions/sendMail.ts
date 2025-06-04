"use server";

import * as nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "mail.hpower.ae",
  port: parseInt(process.env.MAIL_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME || "noreply@hpower.ae",
    pass: process.env.MAIL_PASSWORD || "hpower@200",
  },
  debug: process.env.NODE_ENV === "development",
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
});

// const userEmailTemplate = (name, locale, selectedPlan) => ({
//   subject:
//     locale === "ar"
//       ? `شكراً لاختيار خطة الاشتراك`
//       : `Thank You for Your Subscription Plan Request`,
//   html:
//     locale === "ar"
//       ? `
//     <div style="font-family: 'Tajawal', Arial, sans-serif; background-color: #f0f4f8; margin: 0; padding: 20px; line-height: 1.6; direction: rtl; text-align: center;">
//       <table width="100%" style="margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
//         <tr><td style="background: #2c3e50; color: white; padding: 20px; text-align: center; border-top-left-radius: 12px; border-top-right-radius: 12px;">
//           <h1 style="margin: 0; font-size: 28px;">تم استلام طلب اشتراكك</h1>
//         </td></tr>
//         <tr><td style="padding: 30px; text-align: center;">
//           <h2 style="color: #2c3e50; margin-top: 0; font-size: 24px;">مرحباً ${name},</h2>
//           <p style="margin-bottom: 20px; font-size: 16px;">شكراً لاختيارك خطة الاشتراك <strong>${selectedPlan}</strong> مع HPower. لقد استلمنا تفاصيلك وسنقوم بالتواصل معك في أقرب وقت ممكن.</p>
//           <a href="https://hpower.com" style="display: inline-block; background-color: #2c3e50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">زر موقعنا</a>
//           <p style="margin-top: 20px; font-size: 16px;">مع أطيب التحيات،</p>
//           <p style="font-weight: bold; color: #2c3e50; font-size: 18px;">فريق HPower</p>
//         </td></tr>
//         <tr><td style="background-color: #f1f4f8; padding: 20px; text-align: center; font-size: 0.9em; color: #6c757d; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
//           <p style="margin: 0; font-size: 14px;">2025 HPower. جميع الحقوق محفوظة.</p>
//         </td></tr>
//       </table>
//     </div>`
//       : `
//     <div style="font-family: 'Poppins', Arial, sans-serif; background-color: #f0f4f8; margin: 0; padding: 20px; line-height: 1.6;">
//       <table width="100%" style="margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
//         <tr><td style="background: #2c3e50; color: white; padding: 20px; text-align: center; border-top-left-radius: 12px; border-top-right-radius: 12px;">
//           <h1 style="margin: 0; font-size: 28px;">Subscription Request Received</h1>
//         </td></tr>
//         <tr><td style="padding: 30px; text-align: center;">
//           <h2 style="color: #2c3e50; margin-top: 0; font-size: 24px;">Hello ${name},</h2>
//           <p style="margin-bottom: 20px; font-size: 16px;">Thank you for choosing the <strong>${selectedPlan}</strong> subscription plan with HPower. We have received your details and will contact you as soon as possible.</p>
//           <a href="https://hpower.com" style="display: inline-block; background-color: #2c3e50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">Visit Our Website</a>
//           <p style="margin-top: 20px; font-size: 16px;">Best regards,</p>
//           <p style="font-weight: bold; color: #2c3e50; font-size: 18px;">HPower Team</p>
//         </td></tr>
//         <tr><td style="background-color: #f1f4f8; padding: 20px; text-align: center; font-size: 0.9em; color: #6c757d; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
//           <p style="margin: 0; font-size: 14px;">2025 HPower. All rights reserved.</p>
//         </td></tr>
//       </table>
//     </div>`,
//   text:
//     locale === "ar"
//       ? `مرحباً ${name},\n\nشكراً لاختيارك خطة الاشتراك ${selectedPlan} معنا. لقد استلمنا تفاصيلك وسنقوم بالتواصل معك في أقرب وقت ممكن.\n\nمع أطيب التحيات،\nفريق HPower`
//       : `Hello ${name},\n\nThank you for choosing the ${selectedPlan} subscription plan with us. We have received your details and will contact you as soon as possible.\n\nBest regards,\nHPower Team`,
// });

const adminEmailTemplate = (formData, locale) => {
  const isArabic = locale === "ar";
  const translations = {
    subject: isArabic
      ? `طلب اشتراك جديد من ${formData.companyName}`
      : `New Subscription Request - ${formData.companyName}`,
    header: isArabic ? "مراجعة طلب الاشتراك" : "Review Subscription Request",
    intro: isArabic
      ? `لقد استلمنا طلب اشتراك جديد من: <span style="color: #1a5276;">${formData.companyName}</span>`
      : `We have received a new subscription request from: <span style="color: #1a5276;">${formData.companyName}</span>`,
    detailsHeader: isArabic ? "تفاصيل الطلب" : "Request Details",
    labels: {
      companyName: isArabic ? "اسم الشركة" : "Company Name",
      employees: isArabic ? "عدد الموظفين" : "Number of Employees",
      contactPerson: isArabic ? "الشخص المسؤول" : "Contact Person",
      email: isArabic ? "البريد الإلكتروني" : "Email",
      phoneNumber: isArabic ? "رقم الهاتف" : "Phone",
      website: isArabic ? "موقع الشركة" : "Company Website",
      cities: isArabic ? "المدن المختارة" : "Selected Cities",
      services: isArabic ? "الخدمات المختارة" : "Selected Services",
      plan: isArabic ? "خطة الاشتراك" : "Subscription Plan",
      message: isArabic ? "الرسالة" : "Message",
    },
    footer: isArabic
      ? "2025 HPower. جميع الحقوق محفوظة."
      : "2025 HPower. All rights reserved.",
  };

  const formatServices = (services) => {
    if (!services || services.length === 0) return "—";
    if (services.length > 2) {
      return isArabic
        ? `${services.slice(0, 2).join(", ")} + ${services.length - 2} أخرى`
        : `${services.slice(0, 2).join(", ")} + ${services.length - 2} more`;
    }
    return services.join(", ");
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
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.companyName}:</strong> ${formData.companyName}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.employees}:</strong> ${formData.numberOfEmployees}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.contactPerson}:</strong> ${formData.contactPerson}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.email}:</strong> ${formData.contactEmail}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.phoneNumber}:</strong> ${formData.phoneNumber ? `+971 ${formData.phoneNumber}` : "—"}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.website}:</strong> <a href="${formData.companyWebsite}" style="color: #FF7C44; text-decoration: none;">${formData.companyWebsite}</a></td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.cities}:</strong> ${formData.selectedCities?.join(", ") || "—"}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.services}:</strong> ${formatServices(formData.selectedServices)}</td></tr>
                <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${translations.labels.plan}:</strong> ${formData.selectedPlan || "—"}</td></tr>
                <tr><td style="padding: 10px 0;"><strong>${translations.labels.message}:</strong><br><p style="margin: 10px 0; padding: 10px; background: #e2e8f0; border-radius: 6px; color: #FF7C44;">${formData.message}</p></td></tr>
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

${translations.labels.companyName}: ${formData.companyName}
${translations.labels.employees}: ${formData.numberOfEmployees}
${translations.labels.contactPerson}: ${formData.contactPerson}
${translations.labels.email}: ${formData.contactEmail}
${translations.labels.phoneNumber}: ${formData.phoneNumber ? `+971 ${formData.phoneNumber}` : "—"}
${translations.labels.website}: ${formData.companyWebsite}
${translations.labels.cities}: ${formData.selectedCities?.join(", ") || "—"}
${translations.labels.services}: ${formatServices(formData.selectedServices)}
${translations.labels.plan}: ${formData.selectedPlan || "—"}

${translations.labels.message}:
${formData.message}
  `;

  return {
    subject: translations.subject,
    html,
    text,
  };
};

export async function sendContactForm(formData: any, locale: string) {
  try {
    const formValues = {
      companyName: formData.get("companyName") || "",
      numberOfEmployees: formData.get("numberOfEmployees") || "",
      contactPerson: formData.get("contactPerson") || "",
      contactEmail: formData.get("contactEmail") || "",
      companyWebsite: formData.get("companyWebsite") || "",
      phoneNumber: formData.get("phoneNumber") || "",
      selectedCities: formData.get("selectedCities")?.split(",") || [],
      selectedServices: formData.get("selectedServices")?.split(",") || [],
      selectedPlan: formData.get("selectedPlan") || "",
      message: formData.get("message") || "",
    };

    // Validate required fields
    if (
      !formValues.companyName ||
      !formValues.contactEmail ||
      !formValues.selectedPlan
    ) {
      return {
        success: false,
        error:
          locale === "ar"
            ? "جميع الحقول المطلوبة مفقودة"
            : "Required fields are missing",
      };
    }

    // Send user confirmation email
    // await transporter.sendMail({
    //   from: process.env.MAIL_FROM || "noreply@hpower.ae",
    //   to: formValues.contactEmail,
    //   ...userEmailTemplate(
    //     formValues.contactPerson || formValues.companyName,
    //     locale,
    //     formValues.selectedPlan
    //   ),
    // });

    // Send admin notification email
    await transporter.sendMail({
      from: process.env.MAIL_FROM || "noreply@hpower.ae",
      to: process.env.MAIL_ADMIN || "noreply@hpower.ae",
      ...adminEmailTemplate(formValues, locale),
    });

    return {
      success: true,
      message:
        locale === "ar"
          ? "تم إرسال طلب اشتراكك بنجاح"
          : "Your subscription request has been sent successfully",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error:
        locale === "ar"
          ? "عذراً، حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى لاحقاً"
          : "Sorry, there was an error sending your request. Please try again later",
    };
  }
}
