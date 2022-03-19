import test from 'japa'
import supertest from 'supertest'

import { BASE_URL } from '../utils/urls'
import { generateTestAuth } from '../utils/authentication'
import {
  defaultDoctorOne,
  defaultDoctorTwo,
  defaultDoctorUserTwo,
} from '../../database/seeders/02_User'
import { defaultSpecialty } from '../../database/seeders/04_Specialty'
import { defaultInsurance } from '../../database/seeders/03_Insurance'

/** NOTE: The tests below are related to DoctorController and simulate an user which role is Doctor. */
test.group('UserDoctorController', (group) => {
  let headers: Object

  group.before(async () => {
    const response = await generateTestAuth(
      defaultDoctorUserTwo?.email,
      defaultDoctorUserTwo?.password
    )

    headers = response.headers
  })

  test('should return status 200 (PUT /doctor) when user updates its own professional data', async () => {
    const payload = { crm_document: 'updated crmmm' }

    await supertest(BASE_URL)
      .put(`/doctor/${defaultDoctorTwo.id}`)
      .set(headers)
      .send(payload)
      .expect(200)
  })

  test('should return status 200 (PUT /doctor) when user updates its specialties', async () => {
    const payload = {
      specialties: [defaultSpecialty.id],
    }

    await supertest(BASE_URL)
      .put(`/doctor/${defaultDoctorTwo.id}`)
      .set(headers)
      .send(payload)
      .expect(200)
  })

  test('should return status 200 (PUT /doctor/insurance/:id) when user updates its insurances', async () => {
    const payload = {
      insurances: [{ insurance_id: defaultInsurance.id, price: 350 }],
      flag: 'attach',
    }

    await supertest(BASE_URL)
      .put(`/doctor/insurance/${defaultDoctorTwo.id}`)
      .set(headers)
      .send(payload)
      .expect(200)
  })

  test('should return status 401 (PUT /doctor/insurance/:id) when user tries to update the insurances of another user', async () => {
    const payload = {
      insurances: [{ insurance_id: defaultInsurance.id, price: 350 }],
      flag: 'attach',
    }

    await supertest(BASE_URL)
      .put(`/doctor/insurance/${defaultDoctorOne.id}`)
      .set(headers)
      .send(payload)
      .expect(401)
  })
})
