import { z } from 'zod';

export const sendMessageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty.').max(1000, 'Message is too long.'),
  chatRoomId: z.string().cuid('Invalid Chat Room ID.').optional(), // Optional for new chats
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
