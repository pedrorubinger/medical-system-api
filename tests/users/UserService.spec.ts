import Env from '@ioc:Adonis/Core/Env'
import test from 'japa'
import { Assert } from 'japa/build/src/Assert'

import { Role } from 'App/Models/User'
import UserService from 'App/Services/UserService'
import { rollbackMigrations, runMigrations, runSeeds } from '../../japaFile'
import {
  defaultDeveloperUser,
  defaultUser,
} from '../../database/seeders/02_User'

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
      const data = { email: 'mark@test.com.br', name: 'Mark Doe' }

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
      role: 'doctor' as Role,
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

  test('should not create a new user when an invalid tenant_id is provided', async (assert: Assert) => {
    try {
      const data = {
        email: 'john@test.com',
        password: 'john123123',
        role: 'doctor' as Role,
        name: 'John Doe',
        phone: '31 914384',
        cpf: '12345633910',
        is_admin: false,
        tenant_id: defaultUser.tenant_id * -77,
      }

      await UserService.store(data)
    } catch (err) {
      assert.equal(err?.status, 500)
    }

    /** NOTE: A longer timeout is necessary here because this service's method invokes an email service. */
  }).timeout(50000)

  test('should create a new user which role is doctor', async (assert: Assert) => {
    const data = {
      email: 'mary@test.com',
      password: 'mary123123',
      role: 'doctor' as Role,
      name: 'Mary Doe',
      phone: '32 092384',
      cpf: '10545210910',
      is_admin: false,
      crm_document: 'TEST-MG 8987349',
      tenant_id: defaultUser.tenant_id,
    }
    const { cpf } = await UserService.store(data)

    assert.equal(cpf, '10545210910')
    /** NOTE: A longer timeout is necessary here because this service's method invokes an email service. */
  }).timeout(50000)

  test('should get all registered users', async (assert: Assert) => {
    const users = await UserService.getAll(id, defaultUser.tenant_id)

    assert.isArray(users)
    assert.equal(defaultUser.name, users[0].name)
  })

  test('should get all registered users using all search filters', async (assert: Assert) => {
    const params = {
      cpf: defaultUser.cpf,
      email: defaultUser.email,
      filterOwn: false,
      name: defaultUser.name,
      order: 'asc' as any,
      orderBy: 'cpf' as any,
      page: 1,
      perPage: 10,
      role: defaultUser.role,
    }
    const users = await UserService.getAll(id, defaultUser.tenant_id, params)

    assert.isArray(users)
    assert.equal(defaultUser.name, users[0].name)
  })

  test('should get all registered users using some search filters', async (assert: Assert) => {
    const params = {
      cpf: defaultUser.cpf,
      email: defaultUser.email,
      page: 1,
      perPage: 10,
    }
    const users = await UserService.getAll(id, defaultUser.tenant_id, params)

    assert.isArray(users)
    assert.equal(defaultUser.name, users[0].name)
  })

  test('should get all registered users except the own user', async (assert: Assert) => {
    const params = {
      cpf: defaultUser.cpf,
      email: defaultUser.email,
      filterOwn: true,
      page: 1,
      perPage: 10,
    }
    const users = await UserService.getAll(id, defaultUser.tenant_id, params)

    assert.isArray(users)
    assert.isEmpty(users)
  })

  test('should get all registered users except the own user (passing filterOwn as string)', async (assert: Assert) => {
    const params = {
      cpf: defaultUser.cpf,
      email: defaultUser.email,
      filterOwn: 'true' as any,
      page: 1,
      perPage: 10,
    }
    const users = await UserService.getAll(id, defaultUser.tenant_id, params)

    assert.isArray(users)
    assert.isEmpty(users)
  })

  test('should get all registered users except the own user without the other search filters', async (assert: Assert) => {
    const params = { filterOwn: 'true' as any }
    const users = await UserService.getAll(id, defaultUser.tenant_id, params)

    assert.isArray(users)
    assert.equal(
      users.find((user) => user.id === defaultUser.id)?.id,
      undefined
    )
  })

  test('should return an empty array of users when passing an invalid user id', async (assert: Assert) => {
    try {
      const params = {
        cpf: defaultUser.cpf,
        filterOwn: true,
        page: 1,
        perPage: 10,
      }
      const users = await UserService.getAll(
        null as any,
        defaultUser.tenant_id,
        params
      )

      assert.isUndefined(users)
    } catch (err) {
      assert.equal(err?.status, 404)
    }
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

  test('should not delete a user who is master', async (assert: Assert) => {
    try {
      const hasDeleted = await UserService.destroy(
        defaultDeveloperUser.id,
        defaultDeveloperUser.tenant_id
      )

      assert.isUndefined(hasDeleted)
    } catch (err) {
      assert.equal(err?.code, 'CANNOT_DELETE_MASTER_USER')
    }
  })

  test('should update user password on change profile data', async (assert: Assert) => {
    const user = await UserService.update(id, defaultUser.tenant_id, {
      name: 'John Doe',
      password: defaultUser.password,
      new_password: 'johnson12345',
    })

    assert.equal(user.name, 'John Doe')
  })

  test('should not proceed with a password recovery proccess when user does not exist', async (assert: Assert) => {
    try {
      const hasRequested = await UserService.requestPasswordChange(
        `${defaultUser.email}gdifuaiso399`
      )

      assert.isUndefined(hasRequested)
    } catch (err) {
      assert.equal(err?.code, 'USER_NOT_FOUND')
    }
  })

  test('should not proceed with a password recovery proccess when the email cannot be sent', async (assert: Assert) => {
    const SMTP_HOST = Env.get('SMTP_HOST')

    try {
      if (
        Env.get('NODE_ENV') === 'testing' &&
        process.env.NODE_ENV === 'testing'
      ) {
        Env.set('SMTP_HOST', 'invvvvalid821943@test')
      }

      const hasRequested = await UserService.requestPasswordChange(
        defaultUser.email
      )

      assert.isUndefined(hasRequested)
    } catch (err) {
      assert.equal(err?.status, 500)
    } finally {
      Env.set('SMTP_HOST', SMTP_HOST)
    }

    /** NOTE: A longer timeout is necessary here because this service's method invokes an email service. */
  }).timeout(50000)

  test('should validate the reset password token when the provided token is valid', async (assert: Assert) => {
    const user = await UserService.validateResetToken(
      defaultUser?.reset_password_token as string
    )

    assert.equal(user.email, defaultUser.email)
  })

  test('should validate the reset password token when the provided token is invalid', async (assert: Assert) => {
    try {
      const user = await UserService.validateResetToken(
        `${defaultUser?.reset_password_token}3893njdsf` as string
      )

      assert.isUndefined(user)
    } catch (err) {
      assert.equal(err?.code, 'TOKEN_DOES_NOT_EXIST')
    }
  })

  test('should not reset the user password if the provided user_id is invalid (user not found)', async (assert: Assert) => {
    try {
      const payload = {
        reset_password_token: defaultUser.reset_password_token as string,
        password: 'whatever',
        confirmed: 'whatever',
      }
      const hasChangedPassword = await UserService.setPassword(
        defaultUser.id * -33,
        payload
      )

      assert.isUndefined(hasChangedPassword)
    } catch (error) {
      assert.equal(error?.code, 'USER_NOT_FOUND')
    }
  })

  test('should reset the user password', async (assert: Assert) => {
    const payload = {
      reset_password_token: defaultUser.reset_password_token as string,
      password: 'whatever123',
      confirmed: 'whatever123',
    }
    const user = await UserService.setPassword(defaultUser.id, payload)

    assert.equal(user.id, defaultUser.id)
  })

  test('should not reset the password if the provided token is invalid', async (assert: Assert) => {
    try {
      const payload = {
        reset_password_token:
          `${defaultUser.reset_password_token}nj12uihjds` as string,
        password: 'whatever',
        confirmed: 'whatever',
      }
      const hasChangedPassword = await UserService.setPassword(
        defaultUser.id,
        payload
      )

      assert.isUndefined(hasChangedPassword)
    } catch (error) {
      assert.equal(error?.code, 'NOT_AUTHORIZED_TO_RESET_PASSWORD')
    }
  })

  test('should generate a reset password token and send an email to the user', async (assert: Assert) => {
    const hasRequested = await UserService.requestPasswordChange(
      `${defaultUser.email}`
    )

    assert.isTrue(hasRequested)
    /** NOTE: A longer timeout is necessary here because this service's method invokes an email service. */
  }).timeout(50000)

  test('should delete the specified user', async (assert: Assert) => {
    const hasDeleted = await UserService.destroy(id, defaultUser.tenant_id)

    assert.equal(hasDeleted, true)
  })
})
