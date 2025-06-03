"use client"

import {z} from "zod";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {updateMaster} from "@/actions/master-actions";
import {toast} from "sonner";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/common/icons";

const FormSchema = z.object({
  name: z.string().max(100).optional(),
  profession: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
  contacts: z.array(
    z.object({
      id: z.string().uuid().optional(),
      name: z.string().min(1, {message: "Contact name is required"}).max(50),
      value: z.string().min(1, {message: "Contact link is required"}).max(150),
    })
  )
});

type FormData = z.infer<typeof FormSchema>;

interface EditMasterProfileFormProps {
  initialData: FormData;
}

export const EditMasterProfileForm = ({initialData}: EditMasterProfileFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData
  });

  const contacts = watch('contacts');

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      try {
        await updateMaster(data);
        toast.success("Profile updated successfully!");
        router.refresh();
      } catch (err: any) {
        toast.error("Failed to update profile");
      }
    });
  }

  const addContact = () => {
    setValue('contacts', [...contacts, {name: '', value: ''}]);
  }

  const removeContact = (index: number) => {
    setValue(
      'contacts',
      contacts.filter((_, i) => i !== index)
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl w-full mx-auto">
      <div>
        <Label>Name</Label>
        <Input
          {...register('name')}
          placeholder="John Doe"
        />
        {errors.profession && (
          <p className="text-red-500 text-sm">{errors.profession.message}</p>
        )}
      </div>
      <div>
        <Label>Profession</Label>
        <Input
          {...register('profession')}
          placeholder="CS2 Professional Player"
        />
        {errors.profession && (
          <p className="text-red-500 text-sm">{errors.profession.message}</p>
        )}
      </div>
      <div>
        <Label>Bio</Label>
        <Textarea
          {...register('bio')}
          placeholder="John Doe is a professional Counter-Strike 2 (CS2) player known for their sharp aim, strategic versatility, and consistent performance on the international stage. Representing Team Liquid, they have earned a reputation as a clutch specialist and a key asset in high-pressure tournaments."
        />
        {errors.bio && (
          <p className="text-red-500 text-sm">{errors.bio.message}</p>
        )}
      </div>
      <div>
        <p className="text-sm leading-none font-medium select-none mb-1 pl-3 text-gray-700">Contacts</p>
        <div className="space-y-3">
          {contacts.map((_, index) => (
            <div key={index} className="flex flex-col lg:flex-row gap-2">
              <Input
                {...register(`contacts.${index}.name`)}
                placeholder="email, phone, Instagram"
                className="lg:flex-1"
              />
              <Input
                {...register(`contacts.${index}.value`)}
                placeholder="https://instagram.com/example"
                className="lg:flex-1"
              />
              <Button
                type="button"
                variant='destructive'
                onClick={() => removeContact(index)}
              >
                Remove
                <Icons.remove className="size-6" />
              </Button>
            </div>
          ))}
        </div>
        {errors.contacts && (
          <p className="text-red-500 text-sm">{errors.contacts.message}</p>
        )}
        <Button
          variant="ghost"
          type="button"
          className="mt-2"
          onClick={addContact}
        >
          Add Contact <Icons.add className="size-6" />
        </Button>
      </div>

      <Button
        type="submit"
        variant='elevated-primary'
        className="w-full"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Icons.loader className="size-6 animate-spin" />
            Saving...
          </>
        ) : 'Save Changes'}
      </Button>

    </form>
  );
};