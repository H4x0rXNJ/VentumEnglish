import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const {userId} = await request.json();

        if (!userId) {
            return NextResponse.json({error: "Missing userId"}, {status: 400});
        }

        const id = BigInt(userId);

        const user = await prisma.users.findUnique({
            where: {id},
            select: {enabled: true},
        });

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }
        const isEnabled = !user.enabled;
        const updatedUser = await prisma.users.update({
            where: { id },
            data: {
                enabled: isEnabled,
                account_non_locked: isEnabled,
            },
        });

        const safeUser = {
            ...updatedUser,
            id: updatedUser.id.toString(),
        };

        return NextResponse.json({success: true, user: safeUser});
    } catch (error) {
        return NextResponse.json({error: (error as Error).message}, {status: 500});
    }
}
