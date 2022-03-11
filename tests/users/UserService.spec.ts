import test from 'japa'
import { Assert } from 'japa/build/src/Assert'

import { TRole } from 'App/Models/User'
import UserService from 'App/Services/UserService'
import { rollbackMigrations, runMigrations, runSeeds } from '../../japaFile'
import { defaultUser } from '../../database/seeders/02_User'

const id = defaultUser.id

test.group('UserService', (group) => {
  group.before(async () => {
    await rollbackMigrations()
    await runMigrations()
    await runSeeds()
  })

  group.after(async () => {
    await rollbackMigrations()
  })

  test('should not update a user which id does not exist', async (assert: Assert) => {
    try {
      const data = { email: 'pedro@test.com.br', name: 'Pedro Doe' }

      await UserService.update(99, defaultUser.tenant_id, data)
    } catch (err) {
      assert.equal(err.message, 'This user was not found!')
    }
  })

  test('should not delete a user which id does not exist', async (assert: Assert) => {
    try {
      await UserService.destroy(99, defaultUser.tenant_id)
    } catch (err) {
      assert.equal(err.message, 'This user was not found!')
    }
  })

  test('should not find a user which id does not exist', async (assert: Assert) => {
    try {
      await UserService.find(99, defaultUser.tenant_id)
    } catch (err) {
      assert.equal(err.message, 'This user was not found!')
    }
  })

  test('should create a new user', async (assert: Assert) => {
    const data = {
      email: 'john@test.com',
      password: 'john123123',
      role: 'doctor' as TRole,
      name: 'John Doe',
      phone: '31 914384',
      cpf: '12345633910',
      is_admin: false,
      tenant_id: defaultUser.tenant_id,
    }
    const { cpf } = await UserService.store(data)

    assert.equal(cpf, '12345633910')
    /** NOTE: A longer timeout is necessary here because this service's method invokes an email service. */
  }).timeout(50000)

  test('should get all registered users', async (assert: Assert) => {
    const users = await UserService.getAll(id, defaultUser.tenant_id)

    assert.isArray(users)
    assert.equal(defaultUser.name, users[0].name)
  })

  test('should get the specified user', async (assert: Assert) => {
    const { cpf } = await UserService.find(id, defaultUser.tenant_id)

    assert.equal(cpf, defaultUser.cpf)
  })

  test('should update the specified user', async (assert: Assert) => {
    const user = await UserService.update(id, defaultUser.tenant_id, {
      name: 'John Doe',
    })

    assert.equal(user.name, 'John Doe')
  })

  test('should delete the specified user', async (assert: Assert) => {
    const hasDeleted = await UserService.destroy(id, defaultUser.tenant_id)

    assert.equal(hasDeleted, true)
  })
})
