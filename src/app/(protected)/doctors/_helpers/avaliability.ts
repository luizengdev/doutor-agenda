import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { doctorsTable } from "@/db/schema";

dayjs.extend(utc);
dayjs.locale("pt-br");

export const getAvailability = (doctor: typeof doctorsTable.$inferSelect) => {
  /**
   * Esta função recebe um médico e retorna um objeto com a data e hora de início e fim da sua disponibilidade.
   * Para isso, utiliza a biblioteca dayjs.
   *
   * Exemplo:
   * Se o médico estiver disponível de segunda-feira às 08:00 até quarta-feira às 18:00, o objeto retornado seria:
   * {
   *   from: "2022-01-03T08:00:00-03:00",
   *   to: "2022-01-05T18:00:00-03:00"
   * }
   *
   */
  const from = dayjs()
    .utc()
    .day(doctor.availableFromWeekDay)
    .set("hour", Number(doctor.availableFromTime.split(":")[0]))
    .set("minute", Number(doctor.availableFromTime.split(":")[1]))
    .set("second", Number(doctor.availableFromTime.split(":")[2] || 0))
    .local();
  const to = dayjs()
    .utc()
    .day(doctor.availableToWeekDay)
    .set("hour", Number(doctor.availableToTime.split(":")[0]))
    .set("minute", Number(doctor.availableToTime.split(":")[1]))
    .set("second", Number(doctor.availableToTime.split(":")[2] || 0))
    .local();
  return { from, to };
};
