import {transport} from "../config/mail.config.js";
import {logger} from "../utils/logger.js";
import {EMAIL_SEND_VERIFICATION, EMAIL_SEND_WELCOME} from "./email.template.js";

export const sendEmailVerification = async (emailRecipient, verificationToken) => {
    try {
        const response = await transport.sendMail({
            from: process.env.MAIL_SENDER,
            to: emailRecipient,
            subject: "Verifikasi Email Anda!",
            html: EMAIL_SEND_WELCOME.replace("{verification_token}", verificationToken)
        });
        console.info("Email verifikasi terkirim")
    } catch (err) {
        logger.error("Gagal mengirim email:", err)
    }
}

export const sendWelcomeEmail = async (emailRecipient, fullName) => {
    try {
        const response = await transport.sendMail({
            from: process.env.MAIL_SENDER,
            to: emailRecipient,
            subject: "Verifikasi Email Anda!",
            html: EMAIL_SEND_VERIFICATION.replace("{full_name}", fullName)
        });
        console.info("Email verifikasi terkirim")
    } catch (err) {
        logger.error("Gagal mengirim email:", err)
    }
}

