import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const orderData = await prisma.orderData.findMany();
    return NextResponse.json(orderData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch order data', detail: error.message }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },  
        }
      );
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newOrder = await prisma.orderData.create({
      data: {
        product: data.product,
        quantity: data.quantity,
        price: data.price,
        orderdate: new Date(data.orderdate),
      },
    });
    return NextResponse.json(newOrder);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse(
        JSON.stringify({ error: 'Failed to create order', detail: error.message }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },  
        }
      );
    }
  }
}