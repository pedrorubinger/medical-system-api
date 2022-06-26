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

    const files = request.files('files')
    const payload = { files, appointmentId: request.input('appointment_id') }

    if (!files?.length) {
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

  public async destroy({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params
    const { all } = request.qs() /** Will destroy all records */
    const result = await AppointmentFileService.destroy(
      id,
      auth!.user!.tenant_id,
      all
    )

    return response.status(200).json(result)
  }
}
