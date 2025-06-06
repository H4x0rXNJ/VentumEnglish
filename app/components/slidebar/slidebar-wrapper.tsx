import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "n7J!p$9Xq2@vLm4Rs8*Uz#Yw1&TfGh5K";

export async function GET(req: Request) {
    try {
        const cookieHeader = req.headers.get("cookie") || "";
        const cookies = cookie.parse(cookieHeader);
        const token = cookies.token;

        if (!token) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        return NextResponse.json({ user: decoded });
    } catch {
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
}