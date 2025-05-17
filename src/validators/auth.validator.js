const yup = require('yup');

const loginSchema = yup.object({
  email: yup.string().email().max(255).required(),
  senha: yup.string()
});

const AuthMessageMap = {
    ErrorInvalidLogin: 'Login inválido',
    SuccessOnLogin: 'Login realizado com sucesso',
    ErrorInvalidToken: 'Token inválido',
}

module.exports = { loginSchema, AuthMessageMap };
