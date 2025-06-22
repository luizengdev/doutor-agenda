import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { upsertPatient } from "@/actions/upsert-patient";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patientsTable } from "@/db/schema";

const formSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Nome é obrigatório." }),
    email: z.string().email("Email inválido"),
    phoneNumber: z.string().min(1, { message: "Telefone é obrigatório." }),
    sex: z.enum(["male", "female"]),
  })
  .refine((data) => data.phoneNumber.length >= 10, {
    message: "Telefone inválido",
    path: ["phone"],
  });

interface UpsertPatientFormProps {
  patient?: typeof patientsTable.$inferSelect;
  onSuccess?: () => void;
}

const UpsertPatientForm = ({
  patient,
  onSuccess,
}: UpsertPatientFormProps = {}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: patient?.name ?? "",
      email: patient?.email ?? "",
      phoneNumber: patient?.phoneNumber ?? "",
      sex: patient?.sex ?? "male",
    },
  });

  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess: () => {
      const message = patient
        ? `Paciente ${patient.name} atualizado com sucesso!`
        : "Paciente adicionado com sucesso!";
      toast.success(message);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao adicionar/atualizar paciente.");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertPatientAction.execute({
      ...values,
      id: patient?.id,
      phoneNumber: values.phoneNumber.replace(/\D/g, ""),
      sex: values.sex,
      email: values.email.toLowerCase(),
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {patient ? patient.name : "Adicionar Paciente"}
        </DialogTitle>
        <DialogDescription>
          {patient
            ? "Edite as informações desse paciente"
            : "Adicione uma novo paciente"}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="exemplo@email.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={upsertPatientAction.isPending}>
              {upsertPatientAction.isPending && (
                <Loader2 className="mr-2 animate-spin" />
              )}
              {patient ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertPatientForm;
