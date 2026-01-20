
import { db } from "../lib/db";
import { user, session } from "../lib/schema";
import { count } from "drizzle-orm";

async function check() {
    try {
        console.log("Checking DB connection...");
        const userCount = await db.select({ count: count() }).from(user);
        console.log("User count:", userCount[0].count);

        const sessionCount = await db.select({ count: count() }).from(session);
        console.log("Session count:", sessionCount[0].count);

        console.log("DB check passed.");
        process.exit(0);
    } catch (e) {
        console.error("DB check failed:", e);
        process.exit(1);
    }
}

check();
