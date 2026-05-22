import prisma from '@/lib/db';
import { ProductService } from '@/services/product.service';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // In production, you would want to secure this route with a cron secret key
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    // 1. Cleanup Products
    const productResult = await ProductService.cleanupOldProducts();
    
    // 2. Cleanup Inactive Chats (> 7 days old)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const oldRooms = await prisma.chatRoom.findMany({
      where: { updatedAt: { lt: sevenDaysAgo } },
      select: { id: true }
    });

    let chatsDeleted = 0;
    if (oldRooms.length > 0) {
      const roomIds = oldRooms.map(r => r.id);
      
      // Delete messages first due to foreign key constraints
      await prisma.message.deleteMany({
        where: { chatRoomId: { in: roomIds } }
      });
      
      const chatResult = await prisma.chatRoom.deleteMany({
        where: { id: { in: roomIds } }
      });
      chatsDeleted = chatResult.count;
    }
    
    return NextResponse.json({ 
      success: true, 
      deletedProducts: productResult.count,
      deletedChats: chatsDeleted,
      message: 'Cleanup successful' 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
