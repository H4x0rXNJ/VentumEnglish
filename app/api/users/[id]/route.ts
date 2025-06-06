import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';

export async function DELETE(_: Request, context: { params: { id: string } }) {
    const { id } = context.params;
    const userId = Number(id);
    if (isNaN(userId)) return NextResponse.json({error: 'Invalid ID'}, {status: 400});
    try {
        await prisma.users_roles.deleteMany({ where: { user_id: userId } });
        await prisma.users.delete({ where: { id: userId } });
        return NextResponse.json({message: 'Deleted successfully'});
    } catch (e: unknown) {
        const code = (e as { code?: string })?.code;
        const status = code === 'P2025' ? 404 : 500;
        const error = code === 'P2025' ? 'User not found' : 'Internal server error';
        return NextResponse.json({error}, {status});
    }
}
