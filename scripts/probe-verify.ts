
async function probeVerify() {
    const base = "http://localhost:3000/api/auth";
    const candidates = [
        "/sign-in/email-otp",
        "/sign-in/email-o-t-p",
        "/signIn/emailOtp"
    ];

    console.log("Starting verify probe...");
    for (const c of candidates) {
        try {
            const url = base + c;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "test@example.com", otp: "000000" })
            });
            console.log(`${c} -> ${res.status}`);
            if (res.status !== 404) {
                console.log("✅ FOUND HIT!", c);
            }
        } catch (e: any) {
            console.error(`❌ Error probing ${c}:`, e.message);
        }
    }
}
probeVerify();
