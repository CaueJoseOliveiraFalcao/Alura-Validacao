export function valida(input) {
    const tipoDeInput = input.dataset.tipo
                        //PEGA TOS AS TAG DO HTML COM DATA-//
    if(validadores[tipoDeInput]){
        //validadores = validação data de nascimento e retorna se e verdadeiro
        validadores[tipoDeInput](input)
    }
    if(input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
    } else {
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoDeInput, input)
    }
}


const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

const mensagensDeErro = {
    nome : {
        valueMissing : 'O campo de nome não pode estar vazio'
    },
    email : {
        valueMissing : 'O campo de e-mail não pode estar vazio',
        typeMismatch: 'O email digitado não é válido.'
    },
    senha : {
        valueMissing: 'O campo de senha não pode estar vazio.',
        patternMismatch: 'A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos.'
    },
    dataNascimento : {
        valueMissing: 'O campo de data de nascimento não pode estar vazio.',
        customError: 'Você deve ser maior que 18 anos para se cadastrar.'
    },
    cpf : {
        valueMissing: 'O campo cpf não pode estar vazio.',
        customError: 'O CPF esta repetindo'
    }

}
const validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCpf(input)
}
function mostraMensagemDeErro(tipoDeInput,input){
    let mensagem = ''
    tiposDeErro.forEach(erro => {
        if(input.validity[erro]){
            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })
    return mensagem
}
function validaDataNascimento(input) {
    const dataRecebida = new Date(input.value)
    let mensagem = ''

    if(!maiorQue18(dataRecebida)){
        mensagem = 'Você deve ser maior que 18 anos para se cadastrar'
    }

    input.setCustomValidity(mensagem)
}

function maiorQue18(data){
    const dataAtual = new Date()
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(),data.getUTCDate())

    return dataMais18 <= dataAtual
}
function validaCpf(input){
    const cpfformatado = input.value.replace(/\D/g , '')
    let mensagem = ''

    if (!repetirCpf(cpfformatado)){
        mensagem = 'O CPF esta repetindo'
    }
    input.setCustomValidity(mensagem)
}

function repetirCpf(cpf){
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]
    let CpfValidado = true
    valoresRepetidos.forEach(valor => {
        if (valor == cpf){
            CpfValidado = false
        }
    
    })
    return CpfValidado
}

let soma = ((10 * 1) + (9 * 2) + (8 * 3) + (7 * 4) + (6 * 5) + (5 * 6) + (4 * 7) + (3 * 8) + (2 + 9) ) 