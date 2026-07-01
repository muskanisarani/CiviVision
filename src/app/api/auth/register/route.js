import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { hashPassword, signToken, COOKIE_NAME } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { name, email, mobile, password, city, state, role } = await request.json();

    // Validation
    if (!name || !email || !mobile || !password || !city || !state) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!email.endsWith('@gmail.com')) {
      return NextResponse.json(
        { error: 'Email must be a valid @gmail.com address' },
        { status: 400 }
      );
    }

    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      return NextResponse.json(
        { error: 'Mobile number must be exactly 10 digits' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 400 }
      );
    }

    const existingMobile = await prisma.user.findUnique({ where: { mobile } });
    if (existingMobile) {
      return NextResponse.json(
        { error: 'Mobile number is already registered' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        passwordHash,
        city,
        state,
        ward: 'Sector 5', // Default ward
        role: role || 'user'
      }
    });

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
        role: user.role
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
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
