const yup = require("yup");
const { ErrorsMap } = require("./error.validator.js");

const createScheduleSchema = yup
  .object({
    scheduledAt: yup.date().required(),
    serviceDuration: yup.number().integer().positive().required(),

    clientId: yup.number().nullable(),
    client: yup
      .object({
        name: yup.string().max(255).required(),
        email: yup.string().email().max(255).required(),
        phone: yup.string().max(20).required(),
        cpf: yup.string().length(11).required(),
      })
      .nullable(),
  })
  .test(
    "client-or-id",
    "Você deve enviar clientId ou client",
    function (value) {
      return !!(value.clientId || value.client);
    }
  );

const validateScheduleError = (error) => {
  if (error?.name === "ValidationError") {
    return error?.errors;
  }
  if (error?.code === "ER_DUP_ENTRY") {
    return ["Agendamento já existe"];
  }
  return error;
};

const ScheduleMessageMap = {
  ErrorCreationSchedule: "Erro ao criar agendamento",
  ErrorNotPermittedScheduleDueToConflict:
    "Agendamento não permitido - Conflito de horários",
  ErrorNotSentClient: "Informações do cliente necessárias",
  ScheduleNotFound: "Agendamento não encontrado",
  ErrorShowSchedule: "Erro ao mostrar agendamento",
  SuccessoOnCreateSchedule: "Agendamento criado com sucesso",
  SuccessOnGetSchedule: "Agendamento encontrado com sucesso",
  SuccessOnGetSchedules: "Agendamentos encontrados com sucesso",
  ErrorNotPermittedDueToBusinessClosed:
    "Agendamento não permitido: a loja está fechada neste dia.",
  ErrorNotPermittedDueToOutsideBusinessHours:
    "Agendamento não permitido: fora do horário de funcionamento.",
};

function mapScheduleFields(schedule) {
  if (!schedule) return null;

  const client = schedule.client_id
    ? {
        id: schedule.client_id,
        name: schedule.client_name,
        email: schedule.client_email,
        phone: schedule.client_phone,
        cpf: schedule.client_cpf,
        createdAt: schedule.client_created_at,
        updatedAt: schedule.client_updated_at,
      }
    : null;

  return {
    id: schedule.id,
    clientId: schedule.client_id,
    scheduledAt: schedule.scheduled_at,
    serviceDuration: schedule.service_duration,
    createdAt: schedule.created_at,
    updatedAt: schedule.updated_at,
    ...(client ? { client } : {}),
  };
}

module.exports = {
  createScheduleSchema,
  ScheduleMessageMap,
  validateScheduleError,
  mapScheduleFields,
};
