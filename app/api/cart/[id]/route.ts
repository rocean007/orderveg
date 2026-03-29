import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cartItems } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { verifyToken, extractToken } from '@/lib/auth';
import type { APIResponse } from '@/types';

// PATCH - Update cart item quantity
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = extractToken(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 0) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Invalid quantity' },
        { status: 400 }
      );
    }

    // Verify ownership
    const item = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.id, parseInt(id)),
        eq(cartItems.userId, payload.userId)
      ),
    });

    if (!item) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      );
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      await db.delete(cartItems).where(eq(cartItems.id, parseInt(id)));
      return NextResponse.json<APIResponse>(
        { success: true, message: 'Item removed from cart' },
        { status: 200 }
      );
    }

    // Update quantity
    await db
      .update(cartItems)
      .set({
        quantity: quantity.toString(),
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, parseInt(id)));

    return NextResponse.json<APIResponse>(
      { success: true, message: 'Cart updated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json<APIResponse>(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE - Remove cart item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = extractToken(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify ownership and delete
    const result = await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.id, parseInt(id)),
          eq(cartItems.userId, payload.userId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<APIResponse>(
      { success: true, message: 'Item removed from cart' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete cart item error:', error);
    return NextResponse.json<APIResponse>(
      { success: false, error: 'Failed to remove item' },
      { status: 500 }
    );
  }
}
