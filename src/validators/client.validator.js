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

const validateClientError = (error) => {
    if (error?.name === 'ValidationError') {
        return error?.errors;
    }
    if (error?.code === 'ER_DUP_ENTRY') {
        return ['Cliente já existe'];
    }
    return error;
}

const ClientErrorsMap = {
    ErrorCreationClient: 'Erro ao criar cliente',
    ClientNotFound: 'Cliente não encontrado',
    ErrorShowClient: 'Erro ao buscar cliente',
}

module.exports = { createClientSchema, ClientErrorsMap, validateClientError };
