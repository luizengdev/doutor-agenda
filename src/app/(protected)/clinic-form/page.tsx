import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WithAuthentication from "@/hocs/with-authentication";

import ClinicForm from "./_components/form";

const ClinicFormPage = async () => {
  return (
    <WithAuthentication mustHavePlan>
      <div>
        <Dialog open>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Clínica</DialogTitle>
              <DialogDescription>
                Adicione uma nova clínica para continuar.
              </DialogDescription>
            </DialogHeader>
            <ClinicForm />
          </DialogContent>
        </Dialog>
      </div>
    </WithAuthentication>
  );
};

export default ClinicFormPage;
