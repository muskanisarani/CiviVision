import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, alerts });
  } catch (error) {
    console.error('Alerts GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
