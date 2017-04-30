'use strict'

const Usuario = use('App/Model/Usuario')
const Validator = use('Validator')

const path = require('path')
const Util = require(path.join(__dirname, '/Util/util'))

class LoginController {

    * signup(request, response) {

        const usuarioData = request.only('nome', 'email', 'site', 'senha')
        const validation = yield Validator.validateAll(usuarioData, Usuario.rules) 

        if(validation.fails()) {
            
            yield response.sendView('signup', 
                {error: Util.formatValidationMessages(validation.messages()),
                 usuario: usuarioData})
            return
            
        }

        //Hash password
        usuarioData.senha = yield use('Hash').make(usuarioData.senha)
        
        yield Usuario.create(usuarioData)
        yield request.with({success: 'User created succefully'}).flash()
        response.redirect('/login')
    }

    * login (request, response) {

        if(request.currentUser) {
            response.redirect('/')
        }

        yield response.sendView('login')

    }

    * signin(request, response) {

        const login = request.input('login')
        const senha = request.input('password')
        
        try {
            yield request.auth.attempt(login, senha)
            response.redirect('/')
        } catch (e) {
            yield request.with({error: e.message}).flash()
            response.redirect('back')
        }
    
    }

    * logout(request, response) {
        yield request.auth.logout()
        response.redirect('/login')
        return
    }

}

module.exports = LoginController
