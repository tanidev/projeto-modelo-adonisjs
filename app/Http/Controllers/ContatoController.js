'use strict'

const Contato = use('App/Model/Contato')

const Validator = use('Validator')

const path = require('path')
const Util = require(path.join(__dirname, '/Util/util'))
const moment = require('moment')

class ContatoController {

    * create(request, response) {
        yield response.status(200).sendView('contatos/form')
        return
    }

    * store(request, response) {
        
        const contatoData = request.only('nome', 'email', 'aniversario', 'telefonefixo', 'telefonecelular',
            'telefonecomercial')
        contatoData.usuario_id = request.currentUser.id
        
        const validation = yield Validator.validateAll(contatoData, Contato.rules) 

        if(validation.fails()) {
            
            yield request.withAll()
                .andWith({errors: Util.formatValidationMessages(validation.messages())})
                .flash()
            yield response.redirect('back') 
            return

        }

        //FIX Date
        contatoData.aniversario = moment(contatoData.aniversario, 'DD/MM/YYYY')

        yield Contato.create(contatoData)
        yield request.with({success: 'Contact created succefully'}).flash()
        response.redirect('/')

    }

    * show (request, response) {
        const contatoFound = yield Contato.findBy({id: request.param('id'), usuario_id: request.currentUser.id})
        yield response.sendView('contatos/show', {contato: contatoFound})
    }

    * edit (request, response) {
        const contatoFound = yield Contato
            .query()
            .where({id: request.param('id'), usuario_id: request.currentUser.id})
            .first()

        if(!contatoFound) {
            yield request.with({error: 'Contact not found!'})
            response.redirect('/')
            return
        }
        
        yield response.sendView('contatos/form', {contato: contatoFound})
        return   
    }

    * update (request, response) {

        const contatoData = request.only('nome', 'email', 'aniversario', 'telefonefixo', 'telefonecelular',
            'telefonecomercial')
        
        const contatoFound = yield Contato
            .query()
            .where({id: request.param('id'), usuario_id: request.currentUser.id})
            .first()

        if(!contatoFound) {
            yield request.with({error: 'Contact not found!'})
            response.redirect('/')
            return
        }

        const validation = yield Validator.validateAll(contatoData, Contato.rules(contatoFound.id))

        if(validation.fails()) {
            
            yield request.withAll()
                .andWith({errors: Util.formatValidationMessages(validation.messages())})
                .flash()
                
            yield response.redirect('back') 
            return

        }

         //FIX Date
        contatoData.aniversario = moment(contatoData.aniversario, 'DD/MM/YYYY')

        contatoFound.fill(contatoData)
        yield contatoFound.save();

        yield request.with({success: 'Contact updated succefully'}).flash()
        response.redirect('/')
        
        return
    }

    * destroy (request, response) {

        const contatoFound = yield Contato
            .query()
            .where({id: request.param('id'), usuario_id: request.currentUser.id})
            .first()

        if(!contatoFound) {
            yield request.with({error: 'Contact not found!'})
            response.redirect('/')
            return
        }

        yield contatoFound.delete()

        yield request.with({success: 'Contact deleted succefully'}).flash()
        response.redirect('/')
        return

    }

    * filter (request, response) {

        const filter = request.input('filter');

        let contatosFound = yield Contato
            .query()
            .where('usuario_id', request.currentUser.id)
            .whereRaw('(nome ilike ? OR telefonecelular ilike ?)', [`%${filter}%`, `%${filter}%`])
            .orderBy('nome')
            .fetch()

        contatosFound = contatosFound.toJSON()
        
        if(contatosFound.length)
            yield response
                .sendView('welcome', 
                {contatos: contatosFound, success: `${contatosFound.length} contacts found`})
        else
            yield response
                .sendView('welcome', 
                {contatos: contatosFound, warning: 'Contacts not found'})

    }

}

module.exports = ContatoController
