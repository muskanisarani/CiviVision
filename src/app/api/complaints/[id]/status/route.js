import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/db';
import { verifyAuth } from '../../../../../lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;
    const { status } = await request.json();

    if (!status || !['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: { status }
    });

    // Create system notification for standard user when status is updated
    await prisma.notification.create({
      data: {
        title: `Issue Status Update: ${status}`,
        message: `Your reported complaint for "${complaint.category}" is now marked as "${status}". ${status === 'Resolved' ? 'Please share your feedback on the View Status page.' : ''}`,
        userId: complaint.userId
      }
    });

    return NextResponse.json({ success: true, complaint: updatedComplaint });
  } catch (error) {
    console.error('Complaint Status Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
