import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateAppointmentFileValidator from 'App/Validators/CreateAppointmentFileValidator'
import AppointmentFileService from 'App/Services/AppointmentFileService'

export default class AppointmentFileController {
  public async store({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateAppointmentFileValidator)

    const file = request.file('file')
    const payload = { file, appointmentId: request.input('appointment_id') }

    if (!file || !file.isValid) {
      return response.status(400).json({ code: 'MISSING_OR_INVALID_FILE' })
    }

    const appointmentFile = await AppointmentFileService.store(
      payload,
      auth!.user!.doctor!.id,
      auth!.user!.tenant_id
    )

    return response.status(201).json(appointmentFile)
  }

  public async show({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params
    const appointmentFile = await AppointmentFileService.findByAppointmentId(
      id,
      auth!.user!.tenant_id
    )

    return response.status(200).json(appointmentFile)
  }
}
