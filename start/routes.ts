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

/* TENANT */
Route.group(() => {
  Route.resource('tenant', 'TenantController')
}).middleware(['auth', 'permission:developer'])

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

/* TENANT USER */
Route.group(() => {
  Route.resource('tenant_user', 'TenantUserController')
}).middleware(['auth', 'permission:developer'])

/* AUTH & SESSION */
Route.post('/session', 'AuthController.signIn')
Route.get('/session/validate', 'AuthController.isAuthenticated').middleware([
  'auth',
])

/* DOCTOR */
Route.group(() => {
  Route.post('/doctor', 'DoctorController.store').middleware([
    'auth',
    'permission:admin',
  ])
  Route.get('/doctor', 'DoctorController.index').middleware([
    'auth',
    'permission:admin',
  ])
  Route.get('/doctor/:id', 'DoctorController.show').middleware([
    'auth',
    'permission:admin',
  ])
  Route.put('/doctor/:id', 'DoctorController.update').middleware(['auth'])
  Route.put(
    '/doctor/insurance/:id',
    'DoctorController.manageInsurance'
  ).middleware(['auth'])
  Route.delete('/doctor/:id', 'DoctorController.destroy').middleware([
    'auth',
    'permission:admin',
  ])
})

/* INSURANCE */
Route.group(() => {
  Route.post('/insurance', 'InsuranceController.store').middleware([
    'auth',
    'permission:admin,manager',
  ])
  Route.get('/insurance', 'InsuranceController.index').middleware([
    'auth',
    'permission:admin,manager,doctor',
  ])
  Route.get('/insurance/:id', 'InsuranceController.show').middleware([
    'auth',
    'permission:admin,manager,doctor',
  ])
  Route.put('/insurance/:id', 'InsuranceController.update').middleware([
    'auth',
    'permission:admin,manager',
  ])
  Route.delete('/insurance/:id', 'InsuranceController.destroy').middleware([
    'auth',
    'permission:admin,manager',
  ])
})

/* SPECIALTY */
Route.group(() => {
  Route.post('/specialty', 'SpecialtyController.store').middleware([
    'auth',
    'permission:admin,manager',
  ])
  Route.put('/specialty/:id', 'SpecialtyController.update').middleware([
    'auth',
    'permission:admin,manager',
  ])
  Route.get('/specialty', 'SpecialtyController.index').middleware([
    'auth',
    'permission:admin,manager,doctor',
  ])
  Route.get('/specialty/:id', 'SpecialtyController.show').middleware([
    'auth',
    'permission:admin,manager,doctor',
  ])
  Route.delete('/specialty/:id', 'SpecialtyController.destroy').middleware([
    'auth',
    'permission:admin,manager',
  ])
})

/* PAYMENT METHOD */
Route.group(() => {
  Route.post('/payment_method', 'PaymentMethodController.store').middleware([
    'auth',
    'permission:admin,manager',
  ])
  Route.get('/payment_method', 'PaymentMethodController.index').middleware([
    'auth',
    'permission:admin,manager,doctor',
  ])
  Route.get('/payment_method/:id', 'PaymentMethodController.show').middleware([
    'auth',
    'permission:admin,manager,doctor',
  ])
  Route.put('/payment_method/:id', 'PaymentMethodController.update').middleware(
    ['auth', 'permission:admin,manager']
  )
  Route.delete(
    '/payment_method/:id',
    'PaymentMethodController.destroy'
  ).middleware(['auth', 'permission:admin,manager'])
})

/* SCHEDULE SETTINGS */
Route.group(() => {
  Route.post(
    '/schedule_settings',
    'ScheduleSettingsController.store'
  ).middleware(['auth', 'permission:doctor'])
  Route.get(
    '/schedule_settings',
    'ScheduleSettingsController.index'
  ).middleware(['auth', 'permission:admin'])
  Route.get(
    '/schedule_settings/:id',
    'ScheduleSettingsController.show'
  ).middleware(['auth', 'permission:admin,doctor'])
  Route.put(
    '/schedule_settings/:id',
    'ScheduleSettingsController.update'
  ).middleware(['auth', 'permission:doctor'])
  Route.delete(
    '/schedule_settings/:id',
    'ScheduleSettingsController.destroy'
  ).middleware(['auth', 'permission:doctor'])
})

/* SCHEDULE DAYS OFF */
Route.group(() => {
  Route.post(
    '/schedule_days_off',
    'ScheduleDaysOffController.store'
  ).middleware(['auth', 'permission:doctor'])
  Route.get(
    '/schedule_days_off',
    'ScheduleDaysOffController.findByDoctorId'
  ).middleware(['auth', 'permission:manager,doctor'])
  Route.put(
    '/schedule_days_off/:id',
    'ScheduleDaysOffController.update'
  ).middleware(['auth', 'permission:doctor'])
  Route.delete(
    '/schedule_days_off/:id',
    'ScheduleDaysOffController.destroy'
  ).middleware(['auth', 'permission:doctor'])
})

/* ADDRESS */
Route.group(() => {
  Route.post('/address', 'AddressController.store').middleware([
    'auth',
    'permission:manager,doctor',
  ])
  Route.get('/address', 'AddressController.index').middleware([
    'auth',
    'permission:manager,doctor',
  ])
  Route.get('/address/:id', 'AddressController.show').middleware([
    'auth',
    'permission:manager,doctor',
  ])
  Route.put('/address/:id', 'AddressController.update').middleware([
    'auth',
    'permission:manager,doctor',
  ])
  Route.delete('/address/:id', 'AddressController.destroy').middleware([
    'auth',
    'permission:manager,doctor',
  ])
})

/* PATIENT */
Route.group(() => {
  Route.post('/patient', 'PatientController.store').middleware([
    'auth',
    'permission:manager,doctor',
  ])
  Route.get('/patient', 'PatientController.index').middleware([
    'auth',
    'permission:manager,doctor',
  ])
  Route.get('/patient/:id', 'PatientController.show').middleware([
    'auth',
    'permission:manager,doctor',
  ])
  Route.put('/patient/:id', 'PatientController.update').middleware([
    'auth',
    'permission:manager,doctor',
  ])
  Route.delete('/patient/:id', 'PatientController.destroy').middleware([
    'auth',
    'permission:manager,doctor',
  ])
})
