"use server";

import {z} from "zod";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import prisma from "@/lib/prisma";
import {ScheduleStatus, UserRole} from "@prisma/client";
import {revalidatePath} from "next/cache";

const SlotSchema = z.object({
  startTime: z.string().datetime({message: 'Invalid start time'}),
  endTime: z.string().datetime({message: 'Invalid end time'}),
}).refine((data) => new Date(data.startTime).getTime() < new Date(data.endTime).getTime(), {
  message: 'Start time must be before end time',
  path: ['endTime']
});

export async function getMasterSchedule(startDate?: string, endDate?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
      role: UserRole.MASTER
    }
  });
  if (!user) throw new Error('Role must be MASTER');

  const master = await prisma.master.findUnique({
    where: {userId: session.user.id},
  });
  if (!master) throw new Error('Master not found');

  const whereClause: any = {masterId: master.id};
  if (startDate && endDate) {
    whereClause.startTime = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    }
  }

  const schedules = await prisma.schedule.findMany({
    where: whereClause,
    orderBy: {startTime: 'asc'},
    include: {booking: true}
  });

  return schedules.map((schedule) => ({
    id: schedule.id,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    status: schedule.status,
    bookingId: schedule.bookingId || null
  }));
}

export async function createScheduleSlot(slotData: {startTime: string, endTime: string}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
      role: UserRole.MASTER
    }
  });
  if (!user) throw new Error('Role must be MASTER');

  const master = await prisma.master.findUnique({
    where: {userId: session.user.id},
  });
  if (!master) throw new Error('Master not found');

  const validatedSlotData = SlotSchema.parse(slotData);

  const overlappingSlot = await prisma.schedule.findFirst({
    where: {
      masterId: master.id,
      OR: [
        {
          startTime: {lte: new Date(validatedSlotData.endTime)},
          endTime: {gte: new Date(validatedSlotData.startTime)},
        },
      ],
    },
  });

  if (overlappingSlot) throw new Error('This time slot overlaps with an existing slot');

  const schedule = await prisma.schedule.create({
    data: {
      masterId: master.id,
      startTime: new Date(validatedSlotData.startTime),
      endTime: new Date(validatedSlotData.endTime),
      status: ScheduleStatus.FREE
    }
  });

  revalidatePath('/cabinet/schedule');
  return {success: true, scheduleId: schedule.id};
}

export async function updateScheduleSlot(
  id: string,
  slotData: {
    startTime: string;
    endTime: string;
  }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
      role: UserRole.MASTER
    }
  });
  if (!user) throw new Error('Role must be MASTER');

  const master = await prisma.master.findUnique({
    where: {userId: session.user.id},
  });
  if (!master) throw new Error('Master not found');

  const validatedSlotData = SlotSchema.parse(slotData);

  const overlappingSlot = await prisma.schedule.findFirst({
    where: {
      masterId: master.id,
      id: {not: id},
      OR: [
        {
          startTime: {lte: new Date(validatedSlotData.endTime)},
          endTime: {gte: new Date(validatedSlotData.startTime)},
        }
      ]
    }
  });

  if (overlappingSlot) {
    throw new Error('This time slot overlaps with an existing slot');
  }

  const schedule = await prisma.schedule.update({
    where: {id, masterId: master.id},
    data: {
      startTime: new Date(validatedSlotData.startTime),
      endTime: new Date(validatedSlotData.endTime)
    }
  });

  revalidatePath('/cabinet/schedule');
  return {success: true, scheduleId: schedule.id};
}

export async function deleteScheduleSlot(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
      role: UserRole.MASTER
    }
  });
  if (!user) throw new Error('Role must be MASTER');

  const master = await prisma.master.findUnique({
    where: {userId: session.user.id},
  });
  if (!master) throw new Error('Master not found');

  const schedule = await prisma.schedule.findFirst({
    where: {id, masterId: master.id},
    include: {booking: true}
  });

  if (schedule?.booking) throw new Error('Cannot delete a booked slot');

  await prisma.schedule.delete({
    where: {id, masterId: master.id}
  });

  revalidatePath('/cabinet/schedule');
  return {success: true}
}