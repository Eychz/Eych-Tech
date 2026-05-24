'use server';

import prisma from '@/lib/db';
import { verifySession } from '@/lib/session';

export async function submitSellRequestAction(data: {
  images: string[];
  location: string;
  batteryHealth: string;
  storage: string;
  existingIssue?: string;
  repairHistory?: string;
  price: number;
  underWarranty: boolean;
  inclusions: string;
  contacts: string;
}) {
  try {
    const sellRequest = await prisma.sellRequest.create({
      data: {
        images: data.images,
        location: data.location,
        batteryHealth: data.batteryHealth,
        storage: data.storage,
        existingIssue: data.existingIssue || null,
        repairHistory: data.repairHistory || null,
        price: data.price,
        underWarranty: data.underWarranty,
        inclusions: data.inclusions,
        contacts: data.contacts,
      },
    });
    return { sellRequest: { ...sellRequest, price: Number(sellRequest.price) } };
  } catch (error: any) {
    console.error('Submit sell request error:', error);
    return { error: 'Failed to submit sell request.' };
  }
}

export async function getSellRequestsAction() {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    const requests = await prisma.sellRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const plainRequests = requests.map(req => ({
      ...req,
      price: Number(req.price),
    }));

    return { requests: plainRequests };
  } catch (error: any) {
    return { error: 'Failed to fetch sell requests' };
  }
}

export async function updateSellRequestStatusAction(id: string, status: 'PENDING' | 'REVIEWED' | 'REJECTED') {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    await prisma.sellRequest.update({
      where: { id },
      data: { status },
    });

    return { success: true };
  } catch (error: any) {
    return { error: 'Failed to update sell request status' };
  }
}

export async function deleteSellRequestAction(id: string) {
  try {
    const session = await verifySession();
    if (!session || session.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    await prisma.sellRequest.delete({
      where: { id },
    });

    return { success: true };
  } catch (error: any) {
    return { error: 'Failed to delete sell request' };
  }
}
