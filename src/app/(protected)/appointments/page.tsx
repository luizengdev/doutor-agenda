import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { DataTable } from "@/components/ui/data-table";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { validateAuthentication } from "@/hocs/with-authentication";

import AddAppointmentButton from "./_components/add-appointment-button";
import { appointmentsTableColumns } from "./_components/table-columns";

const AppointmentsPage = async () => {
  const session = await validateAuthentication({ mustHavePlan: true, mustHaveClinic: true });

  const [patients, doctors, appointments] = await Promise.all([
    db.query.patientsTable.findMany({
      where: eq(patientsTable.clinicId, session!.user.clinic!.id),
    }),
    db.query.doctorsTable.findMany({
      where: eq(doctorsTable.clinicId, session!.user.clinic!.id),
    }),
    db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.clinicId, session!.user.clinic!.id),
      with: {
        patient: true,
        doctor: true,
      },
    }),
  ]);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable data={appointments} columns={appointmentsTableColumns} />
      </PageContent>
    </PageContainer>
  );
};

export default AppointmentsPage;
