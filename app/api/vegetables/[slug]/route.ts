import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { vegetables } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import type { APIResponse, VegetableWithDetails } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const vegetable = await db.query.vegetables.findFirst({
      where: and(
        eq(vegetables.slug, slug),
        eq(vegetables.isActive, true)
      ),
    });

    if (!vegetable) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Vegetable not found' },
        { status: 404 }
      );
    }

    // Calculate final price with discount
    const vegetableWithFinalPrice: VegetableWithDetails = {
      ...vegetable,
      finalPrice: vegetable.discount
        ? (parseFloat(vegetable.price) * (1 - vegetable.discount / 100)).toFixed(2)
        : vegetable.price,
    };

    return NextResponse.json<APIResponse<VegetableWithDetails>>(
      { success: true, data: vegetableWithFinalPrice },
      { status: 200 }
    );
  } catch (error) {
    console.error('Vegetable fetch error:', error);
    return NextResponse.json<APIResponse>(
      { success: false, error: 'Failed to fetch vegetable' },
      { status: 500 }
    );
  }
}
