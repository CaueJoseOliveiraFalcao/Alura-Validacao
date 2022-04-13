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
    },
    cep : {
        valueMissing : 'O campo de CEP nao pos estar vazio',
        patternMismatch: 'CEP digitado nao e Valido'
    },
    lougradouro : {
        valueMissing : 'O campo de Lougradouro nao pos estar vazio'
    },
    cidade : {
        valueMissing : 'O campo de Cidade nao pos estar vazio'
    },
    estado : {
        valueMissing : 'O campo de Estado nao pos estar vazio'
    }

}
const validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCpf(input),
    cep:input => RecuperarCEP(input)
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
function checkEsruturaCpf(cpf){
    const multiplicador = 10
    return checaDigitoVerificador(cpf , multiplicador)
}
function checaDigitoVerificador(cpf , multiplicador){
    if(multiplicador >= 12){
        return true
    }
    let multiplicadorInicial = multiplicador
    let soma = 0
    const cpfSemdigito = cpf.substr(0 , multiplicador - 1).split('')
    const digitoVerificador = cpf.charAt(multiplicador - 1)
    for(let i = 0;multiplicadorInicial > 1; multiplicadorInicial--){
        soma = soma + cpfSemdigito[i] * multiplicadorInicial
        i++
    }

    if(digitoVerificador == confirmaDigito(soma)){
        return checaDigitoVerificador(cpf, multiplicador + 1)
    }

    return false
}
function confirmaDigito(soma){
    return 11 - (soma % 11)
}


function RecuperarCEP(input) {
    const cep = input.value.replace(/\D/g, '')
    const url = `http://viacep.com.br/ws/${cep}/json/`
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if(!input.validity.patternMismatch && !input.validity.valueMissing) {
        fetch(url,options).then(
            response => response.json()
        ).then(
            data => {
                if(data.erro) {
                    input.setCustomValidity('Não foi possível buscar o CEP.')
                    return
                }
                input.setCustomValidity('')
                preencheCamposComCEP(data)
                return
            }
        )
    }
}