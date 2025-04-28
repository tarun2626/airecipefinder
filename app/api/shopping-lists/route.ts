import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, items } = await request.json();

    const shoppingList = await prisma.shoppingList.create({
      data: {
        name,
        userId: session.user.id,
        items: {
          create: items.map((item: string) => ({
            name: item,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(shoppingList);
  } catch (error) {
    console.error('Shopping list creation error:', error);
    return NextResponse.json({ error: 'Failed to create shopping list' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shoppingLists = await prisma.shoppingList.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(shoppingLists);
  } catch (error) {
    console.error('Shopping list fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch shopping lists' }, { status: 500 });
  }
} 