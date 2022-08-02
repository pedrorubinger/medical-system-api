import test from 'japa'
import supertest from 'supertest'

import { BASE_URL } from '../utils/urls'
import { defaultInsurance } from '../../database/seeders/03_Insurance'
import { generateTestAuth } from '../utils/authentication'

test.group('InsuranceController', (group) => {
  let headers: Object

  group.before(async () => {
    const response = await generateTestAuth()

    headers = response.headers
  })

  test('should return status 200 (GET /insurance) when user fetchs all insurances', async () => {
    await supertest(BASE_URL).get('/insurance').set(headers).expect(200)
  })

  test('should return status 200 (GET /insurance) when user fetchs all insurances with pagination', async () => {
    await supertest(BASE_URL)
      .get('/insurance?page=1&perPage=10')
      .set(headers)
      .expect(200)
  })

  test('should return status 200 (GET /insurance) when user fetchs all insurances with pagination and filtering an insurance by name', async () => {
    await supertest(BASE_URL)
      .get(`/insurance?page=1&perPage=10&name=${defaultInsurance.name}`)
      .set(headers)
      .expect(200)
  })

  test('should return status 200 (GET /insurance) with an empty array when user fetchs all insurances with pagination and filtering an insurance by name that does not exist', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/insurance?page=1&perPage=10&name=nonexist3nt_insurnace')
      .set(headers)
      .expect(200)

    assert.equal(response.body.data.length, 0)
  })

  test('should return status 200 (GET /insurance/:id) when user finds an insurance', async () => {
    await supertest(BASE_URL)
      .get(`/insurance/${defaultInsurance.id}`)
      .set(headers)
      .expect(200)
  })

  test('should return status 404 (GET /insurance/:id) when user finds an insurance that does not exist', async () => {
    await supertest(BASE_URL)
      .get(`/insurance/${defaultInsurance.id + 10}`)
      .set(headers)
      .expect(404)
  })

  test('should return status 404 (PUT /insurance/:id) when user tries to updante a non-existent insurance', async () => {
    const payload = { name: 'Health Insurance' }

    await supertest(BASE_URL)
      .put(`/insurance/${defaultInsurance.id + 10}`)
      .set(headers)
      .send(payload)
      .expect(404)
  })

  test('should return status 201 (POST /insurance/) when user creates a new insurance', async () => {
    const payload = { name: 'New Insurance', tenant_id: 2 }

    await supertest(BASE_URL)
      .post('/insurance/')
      .set(headers)
      .send(payload)
      .expect(201)
  })

  test('should return status 422 (POST /insurance/) when user tries to create a new insurance with a name that already exists', async () => {
    const payload = { name: 'New Insurance', tenant_id: 2 }

    await supertest(BASE_URL)
      .post('/insurance')
      .set(headers)
      .send(payload)
      .expect(422)
  })

  test('should return status 200 (PUT /insurance/:id) when user updates an insurance', async () => {
    const payload = { name: 'Health Insurance' }

    await supertest(BASE_URL)
      .put(`/insurance/${defaultInsurance.id}`)
      .set(headers)
      .send(payload)
      .expect(200)
  })

  test('should return status 200 (DELETE /insurance/:id) when user deletes an insurance', async () => {
    await supertest(BASE_URL)
      .delete(`/insurance/${defaultInsurance.id}`)
      .set(headers)
      .expect(200)
  })

  test('should return status 404 (DELETE /insurance/:id) when user tries to delete a non-existent insurance', async () => {
    await supertest(BASE_URL)
      .delete(`/insurance/${defaultInsurance.id}`)
      .set(headers)
      .expect(404)
  })
})
