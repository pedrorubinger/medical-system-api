import test from 'japa'
// import { JSDOM } from 'jsdom'
// import supertest from 'supertest'
import { Assert } from 'japa/build/src/Assert'

import { TRole } from 'App/Models/User'
import UserServices from '../../app/Services/UserServices'

// const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

/** TO DO: Implement tests that validate errors... */
test.group('UserService', () => {
  test('should return an empty array of users', async (assert: Assert) => {
    const users = await UserServices.getAll()

    assert.isArray(users)
    assert.lengthOf(users, 0)
  })

  test('should create a new user', async (assert: Assert) => {
    const data = {
      email: 'pedro@test.com',
      password: 'pedro123',
      role: 'doctor' as TRole,
      name: 'Pedro Henrique',
      phone: '31 9126384',
      cpf: '12345678910',
      is_admin: false,
    }
    const { cpf } = await UserServices.store(data)

    assert.equal(cpf, '12345678910')
  })

  test('should get all registered users', async (assert: Assert) => {
    const users = await UserServices.getAll()

    assert.isArray(users)
    assert.equal('Pedro Henrique', users[0].name)
  })

  test('should get the specified user', async (assert: Assert) => {
    const { cpf } = await UserServices.find(1)

    assert.equal(cpf, '12345678910')
  })

  test('should update the specified user', async (assert: Assert) => {
    const user = await UserServices.update(1, { name: 'John Doe' })

    assert.equal(user.name, 'John Doe')
  })

  test('should delete the specified user', async (assert: Assert) => {
    const hasDeleted = await UserServices.destroy(1)

    assert.equal(hasDeleted, true)
  })
})
