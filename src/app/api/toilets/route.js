import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';

export async function GET() {
  try {
    const toilets = await prisma.toilet.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ success: true, toilets });
  } catch (error) {
    console.error('Toilets GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
