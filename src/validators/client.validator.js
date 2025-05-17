const yup = require('yup');
const { ErrorsMap } = require('./error.validator.js');

const createClientSchema = yup.object({
  name: yup.string().max(255).required(),
  email: yup.string().email().max(255).required(),
  phone: yup.string().max(20).required(),
  cpf: yup
    .string()
    .required()
    .length(11, ErrorsMap.InvalidCPF)
});

const mapClientFields = (client) => {
    if (!client) return null;
  
    const schedules = client.schedules?.map(schedule => ({
      id: schedule.id,
      scheduledAt: schedule.scheduled_at,
      serviceDuration: schedule.service_duration,
      createdAt: schedule.created_at,
      updatedAt: schedule.updated_at,
    })) || [];
  
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      cpf: client.cpf,
      isWhatsapp: !!client.is_whatsapp,
      createdAt: client.created_at,
      updatedAt: client.updated_at,
      schedules,
    };
  }

const validateClientError = (error) => {
    if (error?.name === 'ValidationError') {
        return error?.errors;
    }
    if (error?.code === 'ER_DUP_ENTRY') {
        return ['Cliente já existe'];
    }
    return error;
}

const ClientMessageMap = {
    ErrorCreationClient: 'Erro ao criar cliente',
    ClientNotFound: 'Cliente não encontrado',
    ErrorShowClient: 'Erro ao buscar cliente',
    ErrorShowClients: 'Erro ao buscar clientes',
    SuccessoOnCreateClient: 'Cliente criado com sucesso',
    SuccessOnGetClient: 'Cliente encontrado com sucesso',
    SuccessOnGetClients: 'Clientes encontrados com sucesso',
}

module.exports = { createClientSchema, ClientMessageMap, validateClientError, mapClientFields };
