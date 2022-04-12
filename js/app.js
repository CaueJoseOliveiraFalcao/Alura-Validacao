import {valida} from './validacao.js'

const inputs = document.querySelectorAll('input')

inputs.forEach(input => {
    input.addEventListener('blur', (evento) => {
        valida(evento.target)
    })
})
//loop que vai der um por um em cada input verificando ele 