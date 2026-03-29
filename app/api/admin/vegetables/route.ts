import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vegetables } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken, extractToken, sanitizeInput } from '@/lib/auth';
import type { APIResponse } from '@/types';

// Middleware to check admin role
function checkAdmin(token: string | null) {
  if (!token) {
    return { authorized: false, payload: null };
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    return { authorized: false, payload: null };
  }

  return { authorized: true, payload };
}

// POST - Create new vegetable
export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get('authorization'));
    const { authorized } = checkAdmin(token);

    if (!authorized) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      unit,
      stock,
      imageUrl,
      category,
      organic,
      featured,
      discount,
      nutritionInfo,
    } = body;

    // Validation
    if (!name || !slug || !price || !unit) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Name, slug, price, and unit are required' },
        { status: 400 }
      );
    }

    if (parseFloat(price) <= 0) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = await db.query.vegetables.findFirst({
      where: eq(vegetables.slug, slug),
    });

    if (existing) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Slug already exists' },
        { status: 409 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      slug: sanitizeInput(slug),
      description: description ? sanitizeInput(description) : null,
      price: parseFloat(price).toFixed(2),
      unit: sanitizeInput(unit),
      stock: stock ? parseInt(stock) : 0,
      imageUrl: imageUrl ? sanitizeInput(imageUrl) : null,
      category: category ? sanitizeInput(category) : null,
      organic: Boolean(organic),
      featured: Boolean(featured),
      discount: discount ? Math.min(Math.max(parseInt(discount), 0), 100) : 0,
      nutritionInfo: nutritionInfo ? sanitizeInput(nutritionInfo) : null,
      isActive: true,
    };

    const [newVegetable] = await db
      .insert(vegetables)
      .values(sanitizedData)
      .returning();

    return NextResponse.json<APIResponse>(
      { success: true, data: newVegetable, message: 'Vegetable created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create vegetable error:', error);
    return NextResponse.json<APIResponse>(
      { success: false, error: 'Failed to create vegetable' },
      { status: 500 }
    );
  }
}

// GET - Get all vegetables (including inactive) for admin
export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get('authorization'));
    const { authorized } = checkAdmin(token);

    if (!authorized) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const allVegetables = await db.query.vegetables.findMany({
      orderBy: (vegetables, { desc }) => [desc(vegetables.createdAt)],
    });

    return NextResponse.json<APIResponse>(
      { success: true, data: allVegetables },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch vegetables error:', error);
    return NextResponse.json<APIResponse>(
      { success: false, error: 'Failed to fetch vegetables' },
      { status: 500 }
    );
  }
}
