import test from 'japa'
import { Assert } from 'japa/build/src/Assert'

import { TRole } from 'App/Models/User'
import UserService from 'App/Services/UserService'
import { rollbackMigrations, runMigrations } from '../../japaFile'

test.group('UserService', (group) => {
  group.before(async () => {
    await rollbackMigrations()
    await runMigrations()
  })

  test('should return an empty array of users', async (assert: Assert) => {
    const users = await UserService.getAll()

    assert.isArray(users)
    assert.lengthOf(users, 0)
  })

  test('should not update a user which id does not exist', async (assert: Assert) => {
    try {
      const data = { email: 'pedro@test.com.br', name: 'Pedro Doe' }
      const id = 1
      await UserService.update(id, data)
    } catch (err) {
      assert.equal(err.message, 'This user was not found!')
    }
  })

  test('should not delete a user which id does not exist', async (assert: Assert) => {
    try {
      const id = 1
      await UserService.destroy(id)
    } catch (err) {
      assert.equal(err.message, 'This user was not found!')
    }
  })

  test('should not find a user which id does not exist', async (assert: Assert) => {
    try {
      const id = 1
      await UserService.find(id)
    } catch (err) {
      assert.equal(err.message, 'This user was not found!')
    }
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
    const { cpf } = await UserService.store(data)

    assert.equal(cpf, '12345678910')
  })

  test('should get all registered users', async (assert: Assert) => {
    const users = await UserService.getAll()

    assert.isArray(users)
    assert.equal('Pedro Henrique', users[0].name)
  })

  test('should get the specified user', async (assert: Assert) => {
    const { cpf } = await UserService.find(1)

    assert.equal(cpf, '12345678910')
  })

  test('should update the specified user', async (assert: Assert) => {
    const user = await UserService.update(1, { name: 'John Doe' })

    assert.equal(user.name, 'John Doe')
  })

  test('should delete the specified user', async (assert: Assert) => {
    const hasDeleted = await UserService.destroy(1)

    assert.equal(hasDeleted, true)
  })
})
