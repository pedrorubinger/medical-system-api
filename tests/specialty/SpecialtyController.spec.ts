import test from 'japa'
import supertest from 'supertest'

import { BASE_URL } from '../utils/urls'
import { defaultSpecialty } from '../../database/seeders/Specialty'
import { generateTestAuth } from '../utils/authentication'

test.group('SpecialtyController', (group) => {
  let headers: Object

  group.before(async () => {
    const response = await generateTestAuth()

    headers = response.headers
  })

  test('should return status 200 (GET /specialty) when user fetchs all specialties', async () => {
    await supertest(BASE_URL).get('/specialty').set(headers).expect(200)
  })

  test('should return status 200 (GET /specialty) when user fetchs all specialties with pagination', async () => {
    await supertest(BASE_URL)
      .get('/specialty?page=1&perPage=10')
      .set(headers)
      .expect(200)
  })

  test('should return status 200 (GET /specialty) when user fetchs all specialties with pagination and filtering an specialty by name', async () => {
    await supertest(BASE_URL)
      .get(`/specialty?page=1&perPage=10&name=${defaultSpecialty.name}`)
      .set(headers)
      .expect(200)
  })

  test('should return status 200 (GET /specialty) with an empty array when user fetchs all specialties with pagination and filtering an specialty by name that does not exist', async (assert) => {
    const response = await supertest(BASE_URL)
      .get('/specialty?page=1&perPage=10&name=nonexist3nt_insurnace')
      .set(headers)
      .expect(200)

    assert.equal(response.body.data.length, 0)
  })

  test('should return status 200 (GET /specialty/:id) when user finds an specialty', async () => {
    await supertest(BASE_URL)
      .get(`/specialty/${defaultSpecialty.id}`)
      .set(headers)
      .expect(200)
  })

  test('should return status 404 (GET /specialty/:id) when user finds an specialty that does not exist', async () => {
    await supertest(BASE_URL)
      .get(`/specialty/${defaultSpecialty.id + 10}`)
      .set(headers)
      .expect(404)
  })

  test('should return status 404 (PUT /specialty/:id) when user tries to updante a non-existent specialty', async () => {
    const payload = { name: 'Health Specialty' }

    await supertest(BASE_URL)
      .put(`/specialty/${defaultSpecialty.id + 10}`)
      .set(headers)
      .send(payload)
      .expect(404)
  })

  test('should return status 201 (POST /specialty/) when user creates a new specialty', async () => {
    const payload = { name: 'New Specialty' }

    await supertest(BASE_URL)
      .post('/specialty/')
      .set(headers)
      .send(payload)
      .expect(201)
  })

  test('should return status 422 (POST /specialty/) when user tries to create a new specialty with a name that already exists', async () => {
    const payload = { name: 'New Specialty' }

    await supertest(BASE_URL)
      .post('/specialty')
      .set(headers)
      .send(payload)
      .expect(422)
  })

  test('should return status 200 (PUT /specialty/:id) when user updates an specialty', async () => {
    const payload = { name: 'Health Specialty' }

    await supertest(BASE_URL)
      .put(`/specialty/${defaultSpecialty.id}`)
      .set(headers)
      .send(payload)
      .expect(200)
  })

  test('should return status 200 (DELETE /specialty/:id) when user deletes an specialty', async () => {
    await supertest(BASE_URL)
      .delete(`/specialty/${defaultSpecialty.id}`)
      .set(headers)
      .expect(200)
  })

  test('should return status 404 (DELETE /specialty/:id) when user tries to delete a non-existent specialty', async () => {
    await supertest(BASE_URL)
      .delete(`/specialty/${defaultSpecialty.id}`)
      .set(headers)
      .expect(404)
  })
})