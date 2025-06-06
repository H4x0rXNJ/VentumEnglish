import {NextResponse} from 'next/server'
import {prisma} from '@/lib/prisma'
import bcrypt from 'bcrypt'
import {z} from 'zod'
import {randomBytes} from "crypto";
import {sendVerificationEmail} from "@/app/api/send-mail/route";
import {ERROR_CODES, ERROR_MESSAGES} from '@/constants/errors';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export function generateHexCode() {
    return randomBytes(32).toString('hex')
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = registerSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({error: ERROR_MESSAGES.INVALID_INPUT}, {status: 400})
        }

        const {email, password} = parsed.data

        const existingUser = await prisma.users.findUnique({where: {email}})

        if (existingUser) {
            return NextResponse.json({
                message: ERROR_CODES.EMAIL_ALREADY_USE,
                errorCode: ERROR_CODES.EMAIL_ALREADY_USE
            }, {status: 400})
        }

        const code = generateHexCode();

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Guest',
                enabled: false,
                verification_code: code,
                account_non_locked: true,
                failed_attempt: 0,
                created_on: new Date(),
            },
        })

        const role = await prisma.roles.findFirst({where: {name: 'GUEST'}})
        if (!role) {
            return NextResponse.json({error: 'Default role GUEST not found'}, {status: 500})
        }

        await prisma.users_roles.create({
            data: {
                user_id: user.id,
                role_id: role.id,
            },
        })
        await sendVerificationEmail(email, code);

        return NextResponse.json({
            message: `We have sent an email to ${user.email},please click the link included to verify your email address.`,
            userId: user.id.toString()
        })


    } catch (error) {
        console.error(ERROR_MESSAGES.SIGNUP_API_ERROR, error)
        return NextResponse.json({error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR}, {status: 500})
    }
}
