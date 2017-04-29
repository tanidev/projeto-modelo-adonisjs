'use strict'

const Lucid = use('Lucid')

class Usuario extends Lucid {

    contatos() {
        return this.hasMany('App/Model/Contato')
    }

    static get rules () { 
        return {
            email: 'required|email|unique:usuarios',
            senha: 'required',
            nome: 'required'
        }
    }

    static get createTimestamp () {
        return 'datacadastro'
    }

    static get updateTimestamp () {
        return null
    }

    
}

module.exports = Usuario
