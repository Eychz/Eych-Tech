import { ChatRepository } from '@/repositories/chat.repository';

export class ChatService {
  static async sendMessage(senderId: string, senderRole: string, text: string, chatRoomId?: string) {
    let targetRoomId = chatRoomId;

    if (senderRole === 'CUSTOMER') {
      // Customer can only message in their own room
      const room = await ChatRepository.getOrCreateRoom(senderId);
      targetRoomId = room.id;
    } else if (senderRole === 'ADMIN' && !targetRoomId) {
      throw new Error('Admins must specify a chatRoomId to send a message.');
    }

    if (!targetRoomId) {
      throw new Error('Invalid chat room.');
    }

    // saveMessage returns an array of results from $transaction. The message is at index 0.
    const results = await ChatRepository.saveMessage(targetRoomId, senderId, text);
    return results[0];
  }

  static async getRoomHistory(roomId: string) {
    return ChatRepository.getMessages(roomId);
  }

  static async getActiveRooms() {
    return ChatRepository.getActiveRooms();
  }
}
