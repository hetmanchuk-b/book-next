import {Contact, User} from "@prisma/client";

export interface PublicMasterInfo {
  id: string;
  profession: string;
  bio: string;
  user: User;
  contact: Contact[];
}