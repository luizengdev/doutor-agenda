"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createClinic } from "@/actions/create-clinic";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const ClinicFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Nome da clínica é obrigatório" })
    .refine((value) => value.length <= 255, {
      message: "Nome da clínica deve ter no máximo 255 caracteres",
    }),
});

const ClinicForm = () => {
  const form = useForm<z.infer<typeof ClinicFormSchema>>({
    resolver: zodResolver(ClinicFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ClinicFormSchema>) => {
    try {
      await createClinic(data.name);
    } catch (error) {
      if (isRedirectError(error)) {
        // Se for um erro de redirecionamento, não faz nada
        return;
      } else {
        toast.error("Ocorreu um erro ao criar a clínica");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 animate-spin" />
            )}
            Criar Clínica
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ClinicForm;
