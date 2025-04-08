const yup = require('yup');
const { ErrorsMap } = require('./error.validator.js');

const createUserSchema = yup.object({
  nome: yup.string().max(255).required(),
  email: yup.string().email().max(255).required(),
  senha: yup
    .string()
    .required()
    .max(255)
    .min(8, ErrorsMap.MinimumCharsPassword)
    .matches(/[a-zA-Z]/, ErrorsMap.PasswordMustHaveLetters)
    .matches(/\d/, ErrorsMap.PasswordMustHaveNumbers)
    .matches(/[@$!%*?&#^()\-_=+{}[\]|;:'",.<>\\/~]/, ErrorsMap.PasswordMustHaveSpecialChars)
});

const UserErrorsMap = {
    ErrorCreationUser: 'Erro ao criar usuário',
}

module.exports = { createUserSchema, UserErrorsMap };
