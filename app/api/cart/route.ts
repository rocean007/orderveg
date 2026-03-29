import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cartItems, vegetables } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { verifyToken, extractToken } from '@/lib/auth';
import type { APIResponse, Cart, CartItemWithDetails } from '@/types';

// GET cart items
export async function GET(request: NextRequest) {
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

    // Get cart items with vegetable details
    const userCartItems = await db
      .select({
        id: cartItems.id,
        vegetableId: cartItems.vegetableId,
        quantity: cartItems.quantity,
        vegetableName: vegetables.name,
        vegetableSlug: vegetables.slug,
        price: vegetables.price,
        unit: vegetables.unit,
        imageUrl: vegetables.imageUrl,
        organic: vegetables.organic,
        discount: vegetables.discount,
      })
      .from(cartItems)
      .innerJoin(vegetables, eq(cartItems.vegetableId, vegetables.id))
      .where(
        and(
          eq(cartItems.userId, payload.userId),
          eq(vegetables.isActive, true)
        )
      );

    // Calculate subtotals
    const itemsWithSubtotal: CartItemWithDetails[] = userCartItems.map((item) => {
      const price = parseFloat(item.price);
      const quantity = parseFloat(item.quantity);
      const discount = item.discount || 0;
      const subtotal = (price * quantity * (1 - discount / 100)).toFixed(2);

      return {
        ...item,
        subtotal,
      };
    });

    const subtotal = itemsWithSubtotal
      .reduce((sum, item) => sum + parseFloat(item.subtotal), 0)
      .toFixed(2);

    const cart: Cart = {
      items: itemsWithSubtotal,
      subtotal,
      itemCount: itemsWithSubtotal.reduce(
        (sum, item) => sum + parseFloat(item.quantity),
        0
      ),
    };

    return NextResponse.json<APIResponse<Cart>>(
      { success: true, data: cart },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json<APIResponse>(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { vegetableId, quantity } = body;

    if (!vegetableId || !quantity || quantity <= 0) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Invalid vegetable ID or quantity' },
        { status: 400 }
      );
    }

    // Check if vegetable exists and is active
    const vegetable = await db.query.vegetables.findFirst({
      where: and(
        eq(vegetables.id, vegetableId),
        eq(vegetables.isActive, true)
      ),
    });

    if (!vegetable) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Vegetable not found' },
        { status: 404 }
      );
    }

    // Check if item already in cart
    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.userId, payload.userId),
        eq(cartItems.vegetableId, vegetableId)
      ),
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = parseFloat(existingItem.quantity) + parseFloat(quantity);
      
      await db
        .update(cartItems)
        .set({
          quantity: newQuantity.toString(),
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      // Insert new item
      await db.insert(cartItems).values({
        userId: payload.userId,
        vegetableId,
        quantity: quantity.toString(),
      });
    }

    return NextResponse.json<APIResponse>(
      { success: true, message: 'Item added to cart' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json<APIResponse>(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// DELETE - Clear cart
export async function DELETE(request: NextRequest) {
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

    await db.delete(cartItems).where(eq(cartItems.userId, payload.userId));

    return NextResponse.json<APIResponse>(
      { success: true, message: 'Cart cleared' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json<APIResponse>(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
