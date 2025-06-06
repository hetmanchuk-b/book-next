"use server";

import {z} from "zod";
import {getServerSession} from "next-auth";
import {ScheduleStatus, UserRole} from "@prisma/client";
import {revalidatePath} from "next/cache";
import {authOptions} from "@/auth";
import prisma from "@/lib/prisma";

const SlotSchema = z.object({
  startTime: z.string().datetime({message: 'Invalid start time'}),
  endTime: z.string().datetime({message: 'Invalid end time'}),
  status: z.enum([ScheduleStatus.FREE, ScheduleStatus.BOOKED]).optional(),
}).refine((data) => new Date(data.startTime).getTime() < new Date(data.endTime).getTime(), {
  message: 'Start time must be before end time',
  path: ['endTime']
});

const ManySlotsSchema = z.array(SlotSchema).nonempty('At least one slot is required');

export async function getMasterSchedule() {
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

  const schedules = await prisma.schedule.findMany({
    where: {masterId: master.id},
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

export async function createManyScheduleSlots(
  slots: { startTime: string; endTime: string; }[]
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

  const validatedSlots = ManySlotsSchema.parse(slots);

  for (let i = 0; i < validatedSlots.length; i++) {
    for (let j = i + 1; j < validatedSlots.length; j++) {
      const slotA = validatedSlots[i];
      const slotB = validatedSlots[j];
      if (
        (new Date(slotA.startTime) < new Date(slotB.endTime) &&
          new Date(slotA.endTime) > new Date(slotB.startTime)) ||
        (new Date(slotB.startTime) < new Date(slotA.endTime) &&
          new Date(slotB.endTime) > new Date(slotA.startTime))
      ) {
        throw new Error(`Slots at index ${i} and ${j} overlap`);
      }
    }
  }

  const existingSlots = await prisma.schedule.findMany({
    where: {masterId: master.id}
  });

  for (const newSlot of validatedSlots) {
    const overlappingSlot = existingSlots.find((existing) => {
      return (
        (new Date(newSlot.startTime) < existing.endTime && new Date(newSlot.endTime) > existing.startTime)
      );
    });

    if (overlappingSlot) {
      throw new Error(`New slot from ${newSlot.startTime} to ${newSlot.endTime} overlaps with existing slot`);
    }
  }

  const createdSlots = await prisma.$transaction(
    validatedSlots.map((slot) => prisma.schedule.create({
      data: {
        masterId: master.id,
        startTime: new Date(slot.startTime),
        endTime: new Date(slot.endTime),
        status: ScheduleStatus.FREE
      }
    }))
  );

  revalidatePath('/cabinet/schedule');
  return createdSlots.map((schedule) => ({
    success: true,
    scheduleId: schedule.id
  }))
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
          startTime: {lt: new Date(validatedSlotData.endTime)},
          endTime: {gt: new Date(validatedSlotData.startTime)},
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

export async function updateScheduleSlotStatus(
  id: string,
  slotData: {
    startTime: string;
    endTime: string;
    status: ScheduleStatus;
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

  const schedule = await prisma.schedule.update({
    where: {id, masterId: master.id},
    data: {
      startTime: new Date(validatedSlotData.startTime),
      endTime: new Date(validatedSlotData.endTime),
      status: validatedSlotData.status
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