'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.get('/login', 'LoginController.login')
    .post('/login', 'LoginController.signin')

Route.on('/signup').render('signup')
Route.post('signup', 'LoginController.signup')

Route.get('/logout', 'LoginController.logout')

Route.group('authenticated', function(){

    //Welcome
    Route.get('/', 'WelcomeController.welcome')
        .post('/', 'ContatoController.filter')

    //Contatos CRUD
    Route.resource('contatos', 'ContatoController')
        .only('create', 'store', 'show', 'edit', 'update', 'destroy')

}).middleware('auth')



