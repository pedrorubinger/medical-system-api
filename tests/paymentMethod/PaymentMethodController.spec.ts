import test from 'japa'
import supertest from 'supertest'

import { BASE_URL } from '../utils/urls'
import { generateTestAuth } from '../utils/authentication'
import { cashPaymentMethod } from '../../database/seeders/05_PaymentMethod'

test.group('PaymentMethodController', (group) => {
  let headers: Object

  group.before(async () => {
    const response = await generateTestAuth()

    headers = response.headers
  })

  test('should return status 200 (GET /payment_method) when user fetchs all payment_methods', async () => {
    await supertest(BASE_URL).get('/payment_method').set(headers).expect(200)
  })

  test('should return status 200 (GET /payment_method) when user fetchs all payment_methods with pagination', async () => {
    await supertest(BASE_URL)
      .get('/payment_method?page=1&perPage=10')
      .set(headers)
      .expect(200)
  })

  test('should return status 200 (GET /payment_method) when user fetchs all payment_methods with pagination and filtering an payment_method by name', async () => {
    await supertest(BASE_URL)
      .get(`/payment_method?page=1&perPage=10&name=${cashPaymentMethod.name}`)
      .set(headers)
      .expect(200)
  })

  test('should return status 200 (GET /payment_method) with an empty array when user fetchs all payment_methods with pagination and filtering an payment_method by name that does not exist', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/payment_method?page=1&perPage=10&name=nonexist3nt_insurnace')
      .set(headers)
      .expect(200)

    assert.equal(response.body.data.length, 0)
  })

  test('should return status 200 (GET /payment_method/:id) when user finds an payment_method', async () => {
    await supertest(BASE_URL)
      .get(`/payment_method/${cashPaymentMethod.id}`)
      .set(headers)
      .expect(200)
  })

  test('should return status 404 (GET /payment_method/:id) when user finds an payment_method that does not exist', async () => {
    await supertest(BASE_URL)
      .get(`/payment_method/${cashPaymentMethod.id + 10}`)
      .set(headers)
      .expect(404)
  })

  test('should return status 404 (PUT /payment_method/:id) when user tries to updante a non-existent payment_method', async () => {
    const payload = { name: 'Health Insurance' }

    await supertest(BASE_URL)
      .put(`/payment_method/${cashPaymentMethod.id + 10}`)
      .set(headers)
      .send(payload)
      .expect(404)
  })

  test('should return status 201 (POST /payment_method/) when user creates a new payment method', async () => {
    const payload = { name: 'New Insurance', tenant_id: 2 }

    await supertest(BASE_URL)
      .post('/payment_method/')
      .set(headers)
      .send(payload)
      .expect(201)
  })

  test('should return status 422 (POST /payment_method/) when user tries to create a new payment method with a name that already exists', async () => {
    const payload = { name: 'New Insurance', tenant_id: 2 }

    await supertest(BASE_URL)
      .post('/payment_method')
      .set(headers)
      .send(payload)
      .expect(422)
  })

  test('should return status 200 (PUT /payment_method/:id) when user updates an payment_method', async () => {
    const payload = { name: 'Health Insurance' }

    await supertest(BASE_URL)
      .put(`/payment_method/${cashPaymentMethod.id}`)
      .set(headers)
      .send(payload)
      .expect(200)
  })

  test('should return status 200 (DELETE /payment_method/:id) when user deletes an payment_method', async () => {
    await supertest(BASE_URL)
      .delete(`/payment_method/${cashPaymentMethod.id}`)
      .set(headers)
      .expect(200)
  })

  test('should return status 404 (DELETE /payment_method/:id) when user tries to delete a non-existent payment_method', async () => {
    await supertest(BASE_URL)
      .delete(`/payment_method/${cashPaymentMethod.id}`)
      .set(headers)
      .expect(404)
  })
})
