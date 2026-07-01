import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { verifyAuth } from '../../../lib/auth';

export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error('Notifications GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, all } = await request.json();

    if (all) {
      await prisma.notification.updateMany({
        where: { userId: user.id },
        data: { read: true }
      });
    } else if (id) {
      const notification = await prisma.notification.findUnique({ where: { id } });
      if (!notification || notification.userId !== user.id) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
      }
      await prisma.notification.update({
        where: { id },
        data: { read: true }
      });
    } else {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notifications PUT Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
