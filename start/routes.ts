/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

/* USER */
Route.group(() => {
  Route.post('/user', 'UsersController.store').middleware([
    'auth',
    'permission:admin',
  ])
  Route.get('/user', 'UsersController.getAll').middleware([
    'auth',
    'permission:admin',
  ])
  Route.get('/user/:id', 'UsersController.find').middleware([
    'auth',
    'permission:admin',
  ])
  Route.delete('/user/:id', 'UsersController.destroy').middleware([
    'auth',
    'permission:admin',
  ])
})
Route.put('/user/:id', 'UsersController.update').middleware(['auth'])
Route.get('/user/set_password/:token', 'UsersController.validateResetToken')

/* AUTH & SESSION */
Route.post('/session', 'AuthController.signIn')
Route.get('/session/validate', 'AuthController.isAuthenticated').middleware([
  'auth',
])
