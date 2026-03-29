import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  hashPassword,
  generateToken,
  validateEmail,
  validatePassword,
  sanitizeInput,
  checkRateLimit,
} from '@/lib/auth';
import type { APIResponse, AuthResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`register:${ip}`, 5, 3600000)) { // 5 requests per hour
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password, name, phone } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json<APIResponse>(
        { success: false, error: passwordValidation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    const sanitizedName = sanitizeInput(name);
    const sanitizedPhone = phone ? sanitizeInput(phone) : null;

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, sanitizedEmail),
    });

    if (existingUser) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: sanitizedEmail,
        passwordHash,
        name: sanitizedName,
        phone: sanitizedPhone,
        role: 'customer',
      })
      .returning();

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    // Return user data without password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json<APIResponse<AuthResponse>>(
      {
        success: true,
        data: {
          token,
          user: userWithoutPassword,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json<APIResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
