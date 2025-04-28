export const errorValidator = (error) => {
    if (error?.name === 'ValidationError') {
        return error?.errors
    }
    return error
}

export const ErrorsMap = {
    // ? Fields Validation
    PasswordMustHaveMin8Chars: 'A senha deve ter no mínimo 8 caracteres',
    PasswordMustHaveLetters: 'A senha deve conter letras',
    PasswordMustHaveNumbers: 'A senha deve conter números',
    PasswordMustHaveSpecialChars: 'A senha deve conter pelo menos um caractere especial',
    InvalidCPF: 'CPF inválido',
}
