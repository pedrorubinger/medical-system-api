import test from 'japa'
import supertest from 'supertest'

import { BASE_URL } from '../utils/urls'
import { generateTestAuth } from '../utils/authentication'
import {
  defaultDoctorTwo,
  defaultDoctorUserTwo,
} from '../../database/seeders/02_User'

/** TO DO: Implement the rest of tests that envolves user doctor... */
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
})
