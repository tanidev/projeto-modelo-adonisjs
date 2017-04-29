'use strict'

class WelcomeController {

    * welcome(request, response) {

        const usuario = request.currentUser;
        const contatos = yield usuario.contatos().orderBy('nome').fetch()

        yield response.sendView('welcome', {contatos: contatos.toJSON()})

    } 

}

module.exports = WelcomeController
