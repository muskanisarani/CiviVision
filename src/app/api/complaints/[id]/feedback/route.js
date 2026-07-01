import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/db';
import { verifyAuth } from '../../../../../lib/auth';

export async function POST(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;
    const { rating, comment } = await request.json();

    if (rating === undefined || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating. Must be between 1 and 5.' }, { status: 400 });
    }

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    if (complaint.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to review this complaint' }, { status: 403 });
    }

    if (complaint.status !== 'Resolved') {
      return NextResponse.json({ error: 'Feedback can only be submitted for resolved complaints' }, { status: 400 });
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: { rating: parseInt(rating), comment: comment || '' }
    });

    return NextResponse.json({ success: true, complaint: updatedComplaint });
  } catch (error) {
    console.error('Complaint Feedback Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
