import supertest from 'supertest'

import { BASE_URL } from './urls'
import { defaultUser } from '../../database/seeders/User'
import { rollbackMigrations, runMigrations, runSeeds } from '../../japaFile'

interface GenerateTestAuthResponse {
  headers: {
    Authorization: string
    ContentType: string
  }
}

export const generateTestAuth = async (): Promise<GenerateTestAuthResponse> => {
  await rollbackMigrations()
  await runMigrations()
  await runSeeds()

  const response = await supertest(BASE_URL)
    .post('/session')
    .send({
      email: defaultUser.email,
      password: defaultUser.password,
    })
    .expect(200)
  const token = response.body.token

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ContentType: 'application/json',
    },
  }
}
