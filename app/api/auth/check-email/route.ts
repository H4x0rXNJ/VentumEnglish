import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ERROR_CODES } from '@/constants/errors';

export async function POST(req: Request) {
    const { email } = await req.json();
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
        return NextResponse.json({ errorCode: ERROR_CODES.EMAIL_ALREADY_USE }, { status: 400 });
    }
    return NextResponse.json({ message: "Email is available" });
}
