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

const ScheduleErrorsMap = {
  ErrorCreationSchedule: "Erro ao criar agendamento",
};

module.exports = {
  createScheduleSchema,
  ScheduleErrorsMap,
  validateScheduleError,
};
