const yup = require('yup');

const createScheduleSchema = yup.object({
  clientId: yup.number().required(),
  scheduledAt: yup.date().required(),
  serviceDuration: yup.number().integer().positive().required()
});

const validateScheduleError = (error) => {
    if (error?.name === 'ValidationError') {
        return error?.errors;
    }
    if (error?.code === 'ER_DUP_ENTRY') {
        return ['Agendamento já existe'];
    }
    return error;
}

const ScheduleErrorsMap = {
    ErrorCreationSchedule: 'Erro ao criar agendamento',
}

module.exports = { createScheduleSchema, ScheduleErrorsMap, validateScheduleError };
