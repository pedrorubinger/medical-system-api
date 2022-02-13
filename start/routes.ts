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
  Route.post('/user', 'UserController.store').middleware([
    'auth',
    'permission:admin',
  ])
  Route.get('/user', 'UserController.index').middleware([
    'auth',
    'permission:admin',
  ])
  Route.get('/user/:id', 'UserController.show').middleware([
    'auth',
    'permission:admin',
  ])
  Route.delete('/user/:id', 'UserController.destroy').middleware([
    'auth',
    'permission:admin',
  ])
})
Route.put('/user/:id', 'UserController.update').middleware(['auth'])
Route.get('/user/password/validate/:token', 'UserController.validateResetToken')
Route.put(
  '/user/password/change_password',
  'UserController.requestPasswordChange'
)
Route.put('/user/password/set_password/:id', 'UserController.setPassword')

/* AUTH & SESSION */
Route.post('/session', 'AuthController.signIn')
Route.get('/session/validate', 'AuthController.isAuthenticated').middleware([
  'auth',
])

/* DOCTOR */
Route.group(() => {
  Route.resource('/doctor', 'DoctorController')
}).middleware(['auth', 'permission:admin'])

/* INSURANCE */
Route.group(() => {
  Route.resource('/insurance', 'InsuranceController')
}).middleware(['auth', 'permission:admin,manager'])
