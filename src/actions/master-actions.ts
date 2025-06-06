"use server";

import {z} from 'zod';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import {UserRole} from "@prisma/client";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {PublicMasterInfo} from "@/types/general";

const MasterSchema = z.object({
  name: z.string().max(100).optional(),
  profession: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
});

const ContactSchema = z.array(
  z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, {message: "Contact name is required"}).max(50),
    value: z.string().min(1, {message: "Contact link is required"}).max(150),
  }),
);

export async function getPublicMasters(): Promise<PublicMasterInfo[]> {
  const masters = await prisma.master.findMany({
    include: {
      user: {
        include: {contact: true}
      }
    }
  });

  if (!masters.length) throw new Error('No masters found');

  return masters.map((master) => ({
    id: master.id,
    profession: master.profession || '',
    bio: master.bio || '',
    user: master.user,
    contact: master.user.contact
  }));
}

export async function getMasterById(id: string): Promise<PublicMasterInfo> {
  const master = await prisma.master.findUnique({
    where: {id},
    include: {
      user: {
        include: {contact: true}
      }
    }
  });

  if (!master) throw new Error('Master not found');

  return {
    id: master.id,
    profession: master.profession || '',
    bio: master.bio || '',
    user: master.user,
    contact: master.user.contact
  }
}

export async function getMaster() {
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
    where: {
      userId: session.user.id,
    },
    include: {
      user: {
        include: {contact: true}
      }
    }
  });

  if (!master) throw new Error('Master not found');

  return {
    profession: master.profession,
    bio: master.bio,
    user: master.user,
  }
}

export async function updateMaster(
  formData: {
    name?: string;
    profession?: string;
    bio?: string;
    contacts: {id?: string; name: string; value: string}[]
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

  const validatedMaster = MasterSchema.parse({
    name: formData.name,
    profession: formData.profession,
    bio: formData.bio
  });
  const validatedContacts = ContactSchema.parse(formData.contacts);

  await prisma.$transaction(async (prisma) => {
    await prisma.master.update({
      where: {userId: session.user.id},
      data: {
        profession: validatedMaster.profession,
        bio: validatedMaster.bio
      }
    });

    if (validatedMaster.name !== user.name) {
      await prisma.user.update({
        where: {id: session.user.id},
        data: {name: validatedMaster.name}
      })
    }

    const existingContactIds = validatedContacts
      .filter((contact) => contact.id)
      .map((contact) => contact.id!);
    await prisma.contact.deleteMany({
      where: {
        userId: session.user.id,
        id: {notIn: existingContactIds}
      }
    });

    for (const contact of validatedContacts) {
      if (contact.id) {
        await prisma.contact.update({
          where: {id: contact.id, userId: session.user.id},
          data: {name: contact.name, value: contact.value}
        })
      } else {
        await prisma.contact.create({
          data: {
            name: contact.name,
            value: contact.value,
            userId: session.user.id,
          }
        });
      }
    }
  });

  revalidatePath('/cabinet/edit');
  return { success: true };
}