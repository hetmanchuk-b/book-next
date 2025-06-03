"use server";

import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import prisma from "@/lib/prisma";
import {UserRole} from "@prisma/client";

export async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: {id: session.user.id},
    include: {master: true, contact: true}
  });

  if (!user) throw new Error('User now found');

  return user;
}

export async function updateRoleToMaster() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: {id: session.user.id}
  });

  if (!user) throw new Error('User now found');

  const master = await prisma.master.create({
    data: {
      userId: session.user.id,
    }
  });

  if (!master) throw new Error('Error creating master');

  const updateUser = await prisma.user.update({
    where: {id: session.user.id},
    data: {role: UserRole.MASTER}
  });

  if (!updateUser) throw new Error('Error updating user role');

  return null;
}