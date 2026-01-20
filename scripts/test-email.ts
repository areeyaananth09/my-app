
import { sendOTPEmail } from "../lib/email";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function testEmail() {
    console.log("Testing email configuration...");
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    // Don't log full password for security, just presence
    console.log("SMTP_PASS present:", !!process.env.SMTP_PASS);

    const testEmailAddr = process.env.SMTP_USER; // Send to self for testing
    if (!testEmailAddr) {
        console.error("SMTP_USER not set in .env");
        return;
    }

    console.log(`Sending test email to ${testEmailAddr}...`);
    const result = await sendOTPEmail(testEmailAddr, "123456");

    if (result.success) {
        console.log("✅ Email sent successfully!");
        console.log("Message ID:", result.messageId);
    } else {
        console.error("❌ Failed to send email.");
        console.error("Error details:", result.error);
    }
}

testEmail();
