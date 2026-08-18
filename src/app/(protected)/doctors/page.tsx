import { eq } from "drizzle-orm";
import { headers } from "next/headers";

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
import { doctorsTable } from "@/db/schema";
import { validateAuthentication } from "@/hocs/with-authentication";

import AddDoctorButton from "./_components/add-doctor-button";
import DoctorCard from "./_components/doctor-card";

const DoctorsPage = async () => {
  const session = await validateAuthentication({ mustHavePlan: true, mustHaveClinic: true });

  const doctors = await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, session!.user.clinic!.id),
  });
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>
            Gerencie os médicos da sua clínica.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddDoctorButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        {doctors.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Nenhum médico registrado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default DoctorsPage;
