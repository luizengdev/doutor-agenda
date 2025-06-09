import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, time, timestamp, uuid } from "drizzle-orm/pg-core";

// Tabela "users" representa os usuários do sistema
// Relação: 1:N com users_to_clinics
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
});

// Relação entre usuários e clínicas
// Relação: N:N com users_to_clinics
export const usersTablesRelation = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable),
}));

// Tabela "clinics" representa as clínicas
// Relação: N:N com users_to_clinics
export const clinicsTable = pgTable("clinics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Tabela intermediária entre usuários e clínicas
// Relação: N:N com users e clinics
export const usersToClinicsTable = pgTable("users_to_clinics", {
  userId: uuid("user_id").notNull().references(() => usersTable.id),
  clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Relação entre usuários e clínicas na tabela intermediária
// Relação: 1:1 com users e clinics
export const usersToClinicsTablesRelation = relations(usersToClinicsTable, ({ one }) => ({
  user: one(usersTable,
    { fields: [usersToClinicsTable.userId],
      references: [usersTable.id], 
    }),
  clinic: one(clinicsTable,
    { fields: [usersToClinicsTable.clinicId],
      references: [clinicsTable.id], 
    }),
}));

// Relação entre clínicas e outras entidades
// Relação: 1:N com doctors, patients e appointments
export const clinicsTablesRelation = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTable),
  patients: many(patientsTable),
  appointments: many(appointmentsTable),
  usersToClinics: many(usersToClinicsTable),
}));

// Tabela "doctors" representa os médicos
// Relação: 1:N com clinics
export const doctorsTable = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  availableFromWeekDay: integer("available_from_week_day").notNull(),
  availableToWeekDay: integer("available_to_week_day").notNull(),
  availableFroTime: time("available_from_time").notNull(),
  availableToTime: time("available_to_time").notNull(),
  specialty: text("specialty").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Relação entre médicos e clínicas
// Relação: 1:N com appointments e 1:1 com clinics
export const doctorsTablesRelation = relations(doctorsTable, ({ many,one }) => ({
  clinic: one(clinicsTable,
    { fields: [doctorsTable.clinicId],
      references: [clinicsTable.id], 
    }),
    appointments: many(appointmentsTable),
}));

// Enumeração para sexo do paciente
export const patientSexEnum = pgEnum("patient_sex", ["male", "female"]);

// Tabela "patients" representa os pacientes
// Relação: 1:N com clinics
export const patientsTable = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  sex: patientSexEnum("sex").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Relação entre pacientes e clínicas
// Relação: 1:N com appointments e 1:1 com clinics
export const patientsTablesRelation = relations(patientsTable, ({ one, many }) => ({
  clinic: one(clinicsTable,
    { fields: [patientsTable.clinicId],
      references: [clinicsTable.id], 
    }),
    appointments: many(appointmentsTable),
}));

// Tabela "appointments" representa as consultas
// Relação: 1:N com patients, doctors e clinics
export const appointmentsTable = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date").notNull(),
  patientId: uuid("patient_id").notNull().references(() => patientsTable.id, { onDelete: "cascade" }),
  doctorId: uuid("doctor_id").notNull().references(() => doctorsTable.id, { onDelete: "cascade" }),
  clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Relação entre consultas e outras entidades
// Relação: 1:1 com patients, doctors e clinics
export const appointmentsTablesRelation = relations(appointmentsTable, ({ one }) => ({
  patient: one(patientsTable,
    { fields: [appointmentsTable.patientId],
      references: [patientsTable.id], 
    }),
  doctor: one(doctorsTable,
    { fields: [appointmentsTable.doctorId],
      references: [doctorsTable.id], 
    }),
  clinic: one(clinicsTable,
    { fields: [appointmentsTable.clinicId],
      references: [clinicsTable.id], 
    }),
}));