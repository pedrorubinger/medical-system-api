import test from 'japa'
import { Assert } from 'japa/build/src/Assert'

import TenantService from 'App/Services/TenantService'
import { rollbackMigrations, runMigrations, runSeeds } from '../../japaFile'
import {
  defaultOwnerTenant,
  defaultTenant,
} from '../../database/seeders/01_Tenant'

test.group('TenantService', (group) => {
  group.before(async () => {
    await rollbackMigrations()
    await runMigrations()
    await runSeeds()
  })

  group.after(async () => {
    await rollbackMigrations()
  })

  test('should not update a tenant which id does not exist', async (assert: Assert) => {
    try {
      const data = {
        name: 'New Tenant Name',
        is_active: !defaultTenant.is_active,
      }

      await TenantService.update(defaultTenant.id * -3, data)
    } catch (err) {
      assert.equal(err.message, 'This tenant was not found!')
    }
  })

  test('should not delete a tenant which id does not exist', async (assert: Assert) => {
    try {
      await TenantService.destroy(defaultTenant.id * -8)
    } catch (err) {
      assert.equal(err.message, 'This tenant was not found!')
    }
  })

  test('should not find a tenant which id does not exist', async (assert: Assert) => {
    try {
      await TenantService.find(defaultTenant.id * -6)
    } catch (err) {
      assert.equal(err.message, 'This tenant was not found!')
    }
  })

  test('should create a new tenant', async (assert: Assert) => {
    const data = {
      name: 'New Test Tenant Name 001',
      is_active: true,
    }
    const { name } = await TenantService.store(data)

    assert.equal(name, data.name)
  })

  test('should not create a new tenant when the payload is invalid', async (assert: Assert) => {
    try {
      interface TenantData {
        name: string
        is_active: boolean
      }

      const data: TenantData = { name: '', is_active: false }

      await TenantService.store(data)
    } catch (err) {
      assert.equal(err?.status, 422)
    }
  })

  test('should get all registered tenants passing search filters', async (assert: Assert) => {
    const params = {
      page: 1,
      perPage: 50,
      filterOwn: false,
      name: defaultTenant.name,
      order: 'asc' as 'asc' | 'desc' | undefined,
      orderBy: 'name' as 'name' | undefined,
    }
    const tenants = await TenantService.getAll(params, defaultTenant.id)

    assert.isArray(tenants)
    assert.equal(defaultTenant.name, tenants[0].name)
  })

  test('should get all registered tenants without search filters', async (assert: Assert) => {
    const tenants = await TenantService.getAll()

    assert.isArray(tenants)
    assert.isAtLeast(tenants.length, 2)
  })

  test('should get all registered tenants except the own tenant', async (assert: Assert) => {
    const params = { filterOwn: true, page: 1, perPage: 50 }
    const tenants = await TenantService.getAll(params, defaultOwnerTenant.id)

    assert.isArray(tenants)
    assert.equal(
      tenants.find((tenant) => tenant.id === defaultOwnerTenant.id),
      undefined
    )
  })

  test('should get the specified tenant', async (assert: Assert) => {
    const { name } = await TenantService.find(defaultTenant.id)

    assert.equal(name, defaultTenant.name)
  })

  test('should update the specified tenant', async (assert: Assert) => {
    const payload = {
      name: 'Dummy Updated Tenant',
      is_active: !defaultTenant.is_active,
    }
    const user = await TenantService.update(defaultTenant.id, payload)

    assert.equal(user.name, payload.name)
  })

  test('should not delete a tenant which id does not exist', async (assert: Assert) => {
    try {
      const hasDeleted = await TenantService.destroy(defaultTenant.id * -3)

      assert.equal(hasDeleted, undefined)
    } catch (err) {
      assert.equal(err?.message, 'This tenant was not found!')
    }
  })

  test('should delete the specified tenant', async (assert: Assert) => {
    const hasDeleted = await TenantService.destroy(defaultTenant.id)

    assert.equal(hasDeleted, true)
  })
})
