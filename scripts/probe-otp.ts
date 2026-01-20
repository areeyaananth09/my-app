
async function probe() {
    const base = "http://localhost:3000/api/auth";
    const candidates = [
        "/email-otp/send-verification-otp",
        "/email-otp/send-verification-o-t-p",
        "/email-otp/sendVerificationOTP",
        "/emailOtp/sendVerificationOTP",
        "/verify-email/send-verification-otp"
    ];

    console.log("Starting probe...");
    for (const c of candidates) {
        try {
            const url = base + c;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "test@example.com", type: "sign-in" })
            });
            console.log(`${c} -> ${res.status}`);
            if (res.status !== 404) {
                console.log("✅ FOUND HIT!", c);
                const text = await res.text();
                console.log("Response:", text.slice(0, 100));
            }
        } catch (e: any) {
            console.error(`❌ Error probing ${c}:`, e.cause ? e.cause.code : e.message);
        }
    }
}
probe();
