import test from 'japa'
import supertest from 'supertest'

import { BASE_URL } from '../utils/urls'
import { generateTestAuth } from '../utils/authentication'
import { defaultScheduleSettingsOne } from '../../database/seeders/06_ScheduleSettings'
import { defaultDoctorUserTwo } from '../../database/seeders/02_User'

test.group('ScheduleSettingsController', (group) => {
  let headers: Object

  group.before(async () => {
    const response = await generateTestAuth(
      defaultDoctorUserTwo?.email,
      defaultDoctorUserTwo?.password
    )

    headers = response.headers
  })

  test('should return status 401 (GET /schedule_settings) when user with no permissions tries to fetch all schedule settings', async () => {
    await supertest(BASE_URL).get('/schedule_settings').set(headers).expect(401)
  })

  test('should return status 200 (GET /schedule_settings) when user fetchs all schedule settings', async () => {
    const response = await generateTestAuth()

    await supertest(BASE_URL)
      .get('/schedule_settings')
      .set(response.headers)
      .expect(200)
  }).timeout(50000)

  test('should return status 200 (GET /schedule_settings/:id) when user finds a specialty', async () => {
    await supertest(BASE_URL)
      .get(`/schedule_settings/${defaultScheduleSettingsOne.id}`)
      .set(headers)
      .expect(200)
  })

  test('should return status 404 (GET /schedule_settings/:id) when user finds for a schedule settings that does not exist', async () => {
    await supertest(BASE_URL)
      .get(`/schedule_settings/${defaultScheduleSettingsOne.id + 11}`)
      .set(headers)
      .expect(404)
  })

  test('should return status 404 (PUT /schedule_settings/:id) when user tries to updante a non-existent schedule settings', async () => {
    const payload = {
      sunday: { times: ['09:00', '10:00', '10:30', '11:00'] },
      monday: { times: ['13:00'] },
      tuesday: { times: ['13:00'] },
      wednesday: { times: ['13:00'] },
      thursday: { times: ['13:00'] },
      friday: { times: ['12:00'] },
      saturday: { times: ['12:00'] },
      tenant_id: defaultScheduleSettingsOne.tenant_id,
      doctor_id: defaultScheduleSettingsOne.doctor_id,
    }

    await supertest(BASE_URL)
      .put(`/schedule_settings/${defaultScheduleSettingsOne.id + 13}`)
      .set(headers)
      .send(payload)
      .expect(404)
  })

  test('should return status 200 (PUT /schedule_settings/:id) when user updates a schedule settings', async () => {
    const payload = {
      sunday: { times: ['09:00', '10:00', '10:30', '11:00'] },
      monday: { times: ['13:00'] },
      tuesday: { times: ['13:00'] },
      wednesday: { times: ['13:00'] },
      thursday: { times: ['13:00'] },
      friday: { times: ['12:00'] },
      saturday: { times: ['12:00'] },
      tenant_id: defaultScheduleSettingsOne.tenant_id,
      doctor_id: defaultScheduleSettingsOne.doctor_id,
    }

    await supertest(BASE_URL)
      .put(`/schedule_settings/${defaultScheduleSettingsOne.id}`)
      .set(headers)
      .send(payload)
      .expect(200)
  })

  test('should return status 200 (DELETE /schedule_settings/:id) when user deletes a schedule settings', async () => {
    await supertest(BASE_URL)
      .delete(`/schedule_settings/${defaultScheduleSettingsOne.id}`)
      .set(headers)
      .expect(200)
  })

  test('should return status 404 (DELETE /schedule_settings/:id) when user tries to delete a non-existent schedule settings', async () => {
    await supertest(BASE_URL)
      .delete(`/schedule_settings/${defaultScheduleSettingsOne.id}`)
      .set(headers)
      .expect(404)
  })

  test('should return status 201 (POST /schedule_settings/) when user creates a new schedule settings', async () => {
    const payload = { doctor_id: defaultScheduleSettingsOne.doctor_id }

    await supertest(BASE_URL)
      .post('/schedule_settings/')
      .set(headers)
      .send(payload)
      .expect(201)
  })
})
