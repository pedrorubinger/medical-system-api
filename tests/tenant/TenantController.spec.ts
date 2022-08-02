import test from 'japa'
import supertest from 'supertest'

import { BASE_URL } from '../utils/urls'
import { generateTestAuth } from '../utils/authentication'
import { defaultTenant } from '../../database/seeders/01_Tenant'
import { defaultDeveloperUser } from '../../database/seeders/02_User'

/** TO DO: Implement more test cases... */
test.group('TenantController', (group) => {
  let headers: Object

  group.before(async () => {
    const response = await generateTestAuth(
      defaultDeveloperUser.email,
      defaultDeveloperUser.password
    )

    headers = response.headers
  })

  test('should return status 200 (GET /tenant) when an admin user fetches all tenants', async () => {
    await supertest(BASE_URL).get('/tenant').set(headers).expect(200)
  })

  test('should return status 200 (GET /tenant) when an admin user fetches all tenants filtering the own tenant', async () => {
    await supertest(BASE_URL)
      .get('/tenant?filterOwn=true')
      .set(headers)
      .expect(200)
  })

  test('should return status 422 (POST /tenant) when an admin user try to create a new tenant without provide the required fields', async () => {
    const payload = {}

    await supertest(BASE_URL)
      .post('/tenant')
      .set(headers)
      .send(payload)
      .expect(422 || 400)
  })

  test('should return status 201 (POST /tenant) when an admin user creates a new tenant', async () => {
    const payload = {
      name: 'New Test Tenant',
      is_active: true,
    }

    await supertest(BASE_URL)
      .post('/tenant')
      .set(headers)
      .send(payload)
      .expect(201)
  })

  test('should return status 200 (GET /tenant/:id) when an admin user finds a valid tenant', async () => {
    await supertest(BASE_URL)
      .get(`/tenant/${defaultTenant.id}`)
      .set(headers)
      .expect(200)
  })

  test('should return status 404 (PUT /tenant/:id) when an admin user try to update an invalid tenant', async () => {
    const payload = {
      name: 'New Test Tenant Name',
    }

    await supertest(BASE_URL)
      .put(`/tenant/${defaultTenant.id * -32}`)
      .set(headers)
      .send(payload)
      .expect(404)
  })

  test('should return status 200 (PUT /tenant/:id) when an admin user updates a valid tenant', async () => {
    const payload = {
      name: 'New Test Tenant Name',
    }

    await supertest(BASE_URL)
      .put(`/tenant/${defaultTenant.id}`)
      .set(headers)
      .send(payload)
      .expect(200)
  })

  test('should return status 404 (DELETE /tenant/:id) when an admin user tries to delete a non-existent tenant', async () => {
    await supertest(BASE_URL)
      .delete(`/tenant/${defaultTenant.id * -15}`)
      .set(headers)
      .expect(404)
  })

  test('should return status 200 (DELETE /tenant/:id) when an admin user deletes a tenant', async () => {
    await supertest(BASE_URL)
      .delete(`/tenant/${defaultTenant.id}`)
      .set(headers)
      .expect(200)
  })
})
