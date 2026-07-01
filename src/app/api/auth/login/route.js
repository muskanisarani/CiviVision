import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { comparePassword, signToken, COOKIE_NAME } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { value, password, isAdminLogin } = await request.json();

    if (!value || !password) {
      return NextResponse.json(
        { error: 'Credentials value and password are required' },
        { status: 400 }
      );
    }

    const isEmail = value.includes('@');
    let user = null;

    if (isEmail) {
      user = await prisma.user.findUnique({
        where: { email: value.toLowerCase().trim() }
      });
    } else {
      user = await prisma.user.findUnique({
        where: { mobile: value.trim() }
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User credentials not found. Please register first.' },
        { status: 404 }
      );
    }

    if (isAdminLogin && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Not an administrator account.' },
        { status: 403 }
      );
    }

    const passwordValid = await comparePassword(password, user.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid password. Please try again.' },
        { status: 401 }
      );
    }

    // Sign JWT token
    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    // Set Secure HttpOnly Cookie
    const response = NextResponse.json({
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
        avatarUrl: user.avatarUrl
      }
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
