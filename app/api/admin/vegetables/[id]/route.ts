import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vegetables } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken, extractToken, sanitizeInput } from '@/lib/auth';
import type { APIResponse } from '@/types';

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

// PATCH - Update vegetable
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(request.headers.get('authorization'));
    const { authorized } = checkAdmin(token);

    if (!authorized) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Check if vegetable exists
    const existing = await db.query.vegetables.findFirst({
      where: eq(vegetables.id, parseInt(id)),
    });

    if (!existing) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Vegetable not found' },
        { status: 404 }
      );
    }

    // Build update object with sanitized values
    const updateData: any = { updatedAt: new Date() };

    if (body.name) updateData.name = sanitizeInput(body.name);
    if (body.slug) {
      // Check slug uniqueness if changed
      if (body.slug !== existing.slug) {
        const slugExists = await db.query.vegetables.findFirst({
          where: eq(vegetables.slug, body.slug),
        });
        if (slugExists) {
          return NextResponse.json<APIResponse>(
            { success: false, error: 'Slug already exists' },
            { status: 409 }
          );
        }
      }
      updateData.slug = sanitizeInput(body.slug);
    }
    if (body.description !== undefined) {
      updateData.description = body.description ? sanitizeInput(body.description) : null;
    }
    if (body.price) updateData.price = parseFloat(body.price).toFixed(2);
    if (body.unit) updateData.unit = sanitizeInput(body.unit);
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock);
    if (body.imageUrl !== undefined) {
      updateData.imageUrl = body.imageUrl ? sanitizeInput(body.imageUrl) : null;
    }
    if (body.category !== undefined) {
      updateData.category = body.category ? sanitizeInput(body.category) : null;
    }
    if (body.organic !== undefined) updateData.organic = Boolean(body.organic);
    if (body.featured !== undefined) updateData.featured = Boolean(body.featured);
    if (body.discount !== undefined) {
      updateData.discount = Math.min(Math.max(parseInt(body.discount), 0), 100);
    }
    if (body.nutritionInfo !== undefined) {
      updateData.nutritionInfo = body.nutritionInfo ? sanitizeInput(body.nutritionInfo) : null;
    }
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);

    const [updated] = await db
      .update(vegetables)
      .set(updateData)
      .where(eq(vegetables.id, parseInt(id)))
      .returning();

    return NextResponse.json<APIResponse>(
      { success: true, data: updated, message: 'Vegetable updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update vegetable error:', error);
    return NextResponse.json<APIResponse>(
      { success: false, error: 'Failed to update vegetable' },
      { status: 500 }
    );
  }
}

// DELETE - Delete vegetable (soft delete by setting isActive to false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractToken(request.headers.get('authorization'));
    const { authorized } = checkAdmin(token);

    if (!authorized) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Soft delete by setting isActive to false
    const [deleted] = await db
      .update(vegetables)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(vegetables.id, parseInt(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Vegetable not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<APIResponse>(
      { success: true, message: 'Vegetable deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete vegetable error:', error);
    return NextResponse.json<APIResponse>(
      { success: false, error: 'Failed to delete vegetable' },
      { status: 500 }
    );
  }
}
