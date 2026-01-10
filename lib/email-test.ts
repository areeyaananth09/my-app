import nodemailer from 'nodemailer';

// Create test account for development
export async function createTestAccount() {
    const testAccount = await nodemailer.createTestAccount();

    console.log('\n=== TEST EMAIL ACCOUNT CREATED ===');
    console.log('Add these to your .env file:');
    console.log(`SMTP_HOST=${testAccount.smtp.host}`);
    console.log(`SMTP_PORT=${testAccount.smtp.port}`);
    console.log(`SMTP_SECURE=false`);
    console.log(`SMTP_USER=${testAccount.user}`);
    console.log(`SMTP_PASS=${testAccount.pass}`);
    console.log('===================================\n');

    return testAccount;
}

// Run this to get test credentials
createTestAccount();
