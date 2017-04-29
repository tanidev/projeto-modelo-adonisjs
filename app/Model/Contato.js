'use strict'

const Lucid = use('Lucid')

class Contato extends Lucid {

    usuario() {
        return this.belongsTo('App/Model/Usuario')
    }

    static get rules () { 
        return {
            email: 'required|email|unique:contatos',
            nome: 'required',
            usuario_id: 'required'
        }
    }

    static rules (id) { 
        return {
            email: `required|email|unique:contatos,email,id,${id}`,
            nome: 'required',
        }
    }

    static get createTimestamp () {
        return 'datacadastro'
    }

    static get updateTimestamp () {
        return null
    }

}

module.exports = Contato
