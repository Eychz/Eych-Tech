import prisma from '@/lib/db';

export class ChatRepository {
  static async getOrCreateRoom(customerId: string) {
    let room = await prisma.chatRoom.findUnique({
      where: { customerId },
    });

    if (!room) {
      room = await prisma.chatRoom.create({
        data: { customerId },
      });
    }

    return room;
  }

  static async getRoomById(roomId: string) {
    return prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { customer: true },
    });
  }

  static async getActiveRooms() {
    return prisma.chatRoom.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        customer: { select: { email: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  static async getMessagesSince(roomId: string, sinceDate: Date) {
    return prisma.message.findMany({
      where: {
        chatRoomId: roomId,
        createdAt: { gt: sinceDate },
      },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { role: true, email: true } } },
    });
  }

  static async getMessages(roomId: string, limit = 50) {
    return prisma.message.findMany({
      where: { chatRoomId: roomId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { sender: { select: { role: true, email: true } } },
    }).then(messages => messages.reverse()); // Return in chronological order
  }

  static async saveMessage(roomId: string, senderId: string, text: string) {
    return prisma.$transaction([
      prisma.message.create({
        data: {
          chatRoomId: roomId,
          senderId,
          text,
        },
        include: { sender: { select: { role: true, email: true } } },
      }),
      prisma.chatRoom.update({
        where: { id: roomId },
        data: { updatedAt: new Date() },
      })
    ]);
  }
}
