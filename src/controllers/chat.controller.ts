'use server';

import prisma from '@/lib/db';
import { verifySession } from '@/lib/session';

/**
 * Ensures the logged-in customer has a ChatRoom.
 * Returns the ChatRoom ID.
 */
export async function getOrCreateRoomAction() {
  const session = await verifySession();
  if (!session || !session.userId) {
    return { error: 'Unauthorized' };
  }

  // Admin doesn't get a personal room
  if (session.role === 'ADMIN') {
    return { error: 'Admins do not have personal chat rooms' };
  }

  let room = await prisma.chatRoom.findUnique({
    where: { customerId: session.userId },
  });

  if (!room) {
    room = await prisma.chatRoom.create({
      data: { customerId: session.userId },
    });
  }

  return { roomId: room.id };
}

/**
 * Returns all chat rooms for the Admin, ordered by most recently updated.
 * Includes the latest message and customer email.
 */
export async function getAdminRoomsAction() {
  const session = await verifySession();
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  const rooms = await prisma.chatRoom.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      customer: { select: { email: true } },
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
 * Validates that the user is either the customer of the room or an Admin.
 */
export async function getMessagesAction(roomId: string) {
  const session = await verifySession();
  if (!session || !session.userId) {
    return { error: 'Unauthorized' };
  }

  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    return { error: 'Chat room not found' };
  }

  // Ensure access
  if (session.role !== 'ADMIN' && room.customerId !== session.userId) {
    return { error: 'Unauthorized access to chat room' };
  }

  const messages = await prisma.message.findMany({
    where: { chatRoomId: roomId },
    orderBy: { createdAt: 'asc' },
    include: { sender: { select: { role: true } } },
  });

  return { messages };
}

/**
 * Sends a new message in the ChatRoom.
 */
export async function sendMessageAction(roomId: string, text: string) {
  const session = await verifySession();
  if (!session || !session.userId) {
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

  // Ensure access
  if (session.role !== 'ADMIN' && room.customerId !== session.userId) {
    return { error: 'Unauthorized access to chat room' };
  }

  const message = await prisma.message.create({
    data: {
      text: text.trim(),
      chatRoomId: roomId,
      senderId: session.userId,
    },
  });

  // Update room's updatedAt timestamp
  await prisma.chatRoom.update({
    where: { id: roomId },
    data: { updatedAt: new Date() },
  });

  return { message };
}
