import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET (特定のデータ)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await prisma.orderData.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });
    if (!order) {
      return new NextResponse(
        JSON.stringify({ error: 'Order not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' },  
        }
      );
    }
    return NextResponse.json(order);
  } catch (error: unknown) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch order', detail: (error as Error).message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },  
      }
    );
  }
}

// PUT
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const updatedOrder = await prisma.orderData.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        product: data.product,
        quantity: data.quantity,
        price: data.price,
        orderdate: new Date(data.orderdate),
      },
    });
    return NextResponse.json(updatedOrder);
  } catch (error: unknown) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update order', detail: (error as Error).message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },  
      }
    );
  }
}

// DELETE
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deletedOrder = await prisma.orderData.delete({
      where: {
        id: parseInt(id, 10),
      },
    });
    return NextResponse.json(deletedOrder);
  } catch (error: unknown) {
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete order', detail: (error as Error).message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },  
      }
    );
  }
}