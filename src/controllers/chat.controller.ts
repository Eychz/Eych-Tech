'use server';

import prisma from '@/lib/db';
import { verifySession } from '@/lib/session';

/**
 * Ensures a guest ChatRoom exists for the given guestId.
 * No login required — any visitor with a guestId can get a room.
 */
export async function getOrCreateRoomAction(guestId: string) {
  if (!guestId || guestId.trim() === '') {
    return { error: 'Invalid guest ID.' };
  }

  const guestName = `Guest-${guestId.substring(0, 8)}`;

  let room = await prisma.chatRoom.findUnique({
    where: { guestId },
  });

  if (!room) {
    room = await prisma.chatRoom.create({
      data: { guestId, guestName },
    });
  }

  return { roomId: room.id };
}

/**
 * Returns all chat rooms for the Admin, ordered by most recently updated.
 */
export async function getAdminRoomsAction() {
  const session = await verifySession();
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  const rooms = await prisma.chatRoom.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  return { rooms };
}

/**
 * Returns all messages for a given ChatRoom.
 * Accessible by the guest who owns the room (via guestId) OR an Admin.
 */
export async function getMessagesAction(roomId: string, guestId?: string) {
  const session = await verifySession();
  const isAdmin = session?.role === 'ADMIN';

  if (!isAdmin && !guestId) {
    return { error: 'Unauthorized' };
  }

  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    return { error: 'Chat room not found' };
  }

  // Guests can only access their own room
  if (!isAdmin && room.guestId !== guestId) {
    return { error: 'Unauthorized access to chat room' };
  }

  const messages = await prisma.message.findMany({
    where: { chatRoomId: roomId },
    orderBy: { createdAt: 'asc' },
  });

  return { messages };
}

/**
 * Sends a new message in the ChatRoom.
 * Guest sends with guestId; Admin sends with session.
 */
export async function sendMessageAction(roomId: string, text: string, guestId?: string) {
  const session = await verifySession();
  const isAdmin = session?.role === 'ADMIN';

  if (!isAdmin && !guestId) {
    return { error: 'Unauthorized' };
  }

  if (!text.trim()) {
    return { error: 'Message cannot be empty' };
  }

  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    return { error: 'Chat room not found' };
  }

  // Verify access
  if (!isAdmin && room.guestId !== guestId) {
    return { error: 'Unauthorized access to chat room' };
  }

  const message = await prisma.message.create({
    data: {
      text: text.trim(),
      chatRoomId: roomId,
      senderId: isAdmin ? session!.userId : null,
      guestId: isAdmin ? null : guestId,
      isAdmin: isAdmin,
    },
  });

  // Update room's updatedAt timestamp
  await prisma.chatRoom.update({
    where: { id: roomId },
    data: { updatedAt: new Date() },
  });

  return { message };
}
