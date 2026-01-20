import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";

export default async function DebugPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('better-auth.session_token');

    console.log('[Debug] Session cookie:', sessionCookie);

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    console.log('[Debug] Session from Better Auth:', session);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Debug Session</h1>
            <div className="space-y-4">
                <div>
                    <h2 className="font-semibold">Cookie:</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        {JSON.stringify(sessionCookie, null, 2)}
                    </pre>
                </div>
                <div>
                    <h2 className="font-semibold">Session:</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto">
                        {JSON.stringify(session, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
