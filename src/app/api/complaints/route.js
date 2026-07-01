import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { verifyAuth } from '../../../lib/auth';

export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let complaints;

    if (user.role === 'admin') {
      complaints = await prisma.complaint.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true,
              mobile: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      complaints = await prisma.complaint.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json({ success: true, complaints });
  } catch (error) {
    console.error('Complaints GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { category, details, photoUrl, latitude, longitude, locationName, durationDays } = await request.json();

    if (!category || !details) {
      return NextResponse.json({ error: 'Category and details are required' }, { status: 400 });
    }

    // Create complaint in DB
    const complaint = await prisma.complaint.create({
      data: {
        category,
        details,
        photoUrl,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        locationName,
        durationDays: durationDays || 'Today',
        status: 'Pending',
        userId: user.id
      }
    });

    // Create automatic system notification for user
    await prisma.notification.create({
      data: {
        title: 'Complaint Registered successfully',
        message: `Your report regarding "${category}" at ${locationName || 'pinned coordinates'} has been received. Our team will review it shortly. SLA resolution target is active.`,
        userId: user.id
      }
    });

    return NextResponse.json({ success: true, complaint });
  } catch (error) {
    console.error('Complaints POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
