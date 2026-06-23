import { headers } from "next/headers"

export async function isLocalRequest() {
    const headerList = await headers()
    const host = headerList.get("host") || ""
    return host.includes("localhost") || host.includes("127.0.0.1") || host.startsWith("192.168.") || host.includes("::1")
}

export function getBaseUrl(): string {
    return process.env.NEXT_PUBLIC_BASE_URL || "https://drayko.xyz"
}
