import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { verifyAuth } from '../../../lib/auth';

export async function PUT(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, mobile, ward, language, avatarType, avatarBadge, avatarUrl } = await request.json();

    // Check if mobile is unique (excluding current user)
    if (mobile && mobile !== user.mobile) {
      const existingMobile = await prisma.user.findFirst({
        where: {
          mobile,
          id: { not: user.id }
        }
      });
      if (existingMobile) {
        return NextResponse.json({ error: 'Mobile number is already registered' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : user.name,
        mobile: mobile !== undefined ? mobile : user.mobile,
        ward: ward !== undefined ? ward : user.ward,
        language: language !== undefined ? language : user.language,
        avatarType: avatarType !== undefined ? avatarType : user.avatarType,
        avatarBadge: avatarBadge !== undefined ? avatarBadge : user.avatarBadge,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : user.avatarUrl
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        city: updatedUser.city,
        state: updatedUser.state,
        ward: updatedUser.ward,
        role: updatedUser.role,
        avatarType: updatedUser.avatarType,
        avatarBadge: updatedUser.avatarBadge,
        avatarUrl: updatedUser.avatarUrl,
        language: updatedUser.language
      }
    });
  } catch (error) {
    console.error('Profile PUT Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
