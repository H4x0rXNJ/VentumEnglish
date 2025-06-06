import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
import {sendResetPasswordEmail} from '../../send-mail/route';
import {generateHexCode} from "@/app/api/sign-up/route";
import {ERROR_CODES, RATE_LIMIT_WAIT} from "@/constants/errors";

const TOKEN_EXPIRY_MS = 15 * 60 * 1000;
const RATE_LIMIT_MS = 60000;

export async function POST(req: Request) {
    const {email} = await req.json();
    const user = await prisma.users.findUnique({where: {email}});
    if (!user) {
        return NextResponse.json({errorCode: ERROR_CODES.USER_NOT_FOUND}, {status: 404});
    }

    const now = Date.now();
    const lastRequested = user.reset_password_requested_at?.getTime() ?? 0;
    const timeSinceLast = now - lastRequested;

    const token = generateHexCode();
    const tokenExpiry = new Date(now + TOKEN_EXPIRY_MS);

    if (timeSinceLast < RATE_LIMIT_MS) {
        return NextResponse.json(
            {
                message: RATE_LIMIT_WAIT
            },
            {status: 429}
        );
    }
    await prisma.users.update({
        where: {email},
        data: {
            reset_password_token: token,
            reset_password_token_expiration_time: tokenExpiry,
            reset_password_requested_at: new Date(now),
        },
    });

    await sendResetPasswordEmail(email, token);

    return NextResponse.json({
        message: `If a user with the email ${email} exists, we have sent an email containing instructions on how to reset your password.`
    });

}


