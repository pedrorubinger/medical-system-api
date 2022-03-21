import test from 'japa'
import supertest from 'supertest'

import { BASE_URL } from '../utils/urls'
import { generateTestAuth } from '../utils/authentication'
import {
  defaultDoctorOne,
  defaultDoctorTwo,
  defaultDoctorUserOne,
  defaultDoctorUserTwo,
} from '../../database/seeders/02_User'

test.group('DoctorController', (group) => {
  let headers: Object

  group.before(async () => {
    const response = await generateTestAuth()

    headers = response.headers
  })

  test('should return status 200 (GET /doctor) when user fetches doctors list', async () => {
    await supertest(BASE_URL).get('/doctor').set(headers).expect(200)
  })

  test('should return status 200 (GET /doctor/:id) when user fetches a specified doctor', async () => {
    await supertest(BASE_URL)
      .get(`/doctor/${defaultDoctorOne.id}`)
      .set(headers)
      .expect(200)
  })

  test('should return status 404 (GET /doctor/:id) when user fetches a doctor that does not exist', async () => {
    await supertest(BASE_URL)
      .get(`/doctor/${defaultDoctorOne.id + 33}`)
      .set(headers)
      .expect(404)
  })

  test('should return status 422 (POST /doctor) when user tries to create a doctor with no CRM document', async () => {
    const payload = { user_id: defaultDoctorUserTwo.id }

    await supertest(BASE_URL)
      .post('/doctor')
      .set(headers)
      .send(payload)
      .expect(422)
  })

  test('should return status 201 (POST /doctor)', async () => {
    const payload = {
      tenant_id: defaultDoctorUserTwo.tenant_id,
      user_id: defaultDoctorUserTwo.id,
      crm_document: 'CRM-SP 349122',
    }

    await supertest(BASE_URL)
      .post('/doctor')
      .set(headers)
      .send(payload)
      .expect(201)
  })

  test('should return status 500 (POST /doctor) when user try to create a doctor providing an invalid user_id', async () => {
    const payload = {
      tenant_id: defaultDoctorUserTwo.tenant_id,
      user_id: defaultDoctorUserTwo.id * 43,
      crm_document: 'TEST CRMPR 38912',
    }

    await supertest(BASE_URL)
      .post('/doctor')
      .set(headers)
      .send(payload)
      .expect(500)
  })

  test('should return status 401 (PUT /doctor/:id) when user tries to update a doctor which id does not exist', async () => {
    const payload = { crm_document: 'new crm' }

    await supertest(BASE_URL)
      .put(`/doctor/${defaultDoctorUserTwo.id}`)
      .set(headers)
      .send(payload)
      .expect(401)
  })

  test('should return status 401 (PUT /doctor/:id) when user tries to update the professional data of another user', async () => {
    const payload = { crm_document: 'updated crmmm' }

    await supertest(BASE_URL)
      .put(`/doctor/${defaultDoctorTwo.id}`)
      .set(headers)
      .send(payload)
      .expect(401)
  })

  test('should return status 404 (DELETE /doctor/:id) when user tries to delete a doctor which id does not exist', async () => {
    await supertest(BASE_URL)
      .delete(`/doctor/${defaultDoctorUserOne.id * -44}`)
      .set(headers)
      .expect(404)
  })

  test('should return status 200 (DELETE /doctor/:id) when user deletes a specified doctor', async () => {
    await supertest(BASE_URL)
      .delete(`/doctor/${defaultDoctorOne.id}`)
      .set(headers)
      .expect(200)
  })
})
