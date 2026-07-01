import { NextResponse } from 'next/server';
import { verifyAuth } from '../../../../lib/auth';

export async function GET(request) {
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized session' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      city: user.city,
      state: user.state,
      ward: user.ward,
      role: user.role,
      avatarType: user.avatarType,
      avatarBadge: user.avatarBadge,
      avatarUrl: user.avatarUrl,
      language: user.language
    }
  });
}
