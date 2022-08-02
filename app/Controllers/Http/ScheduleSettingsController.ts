import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateScheduleSettingsValidator from 'App/Validators/CreateScheduleSettingsValidator'
import UpdateScheduleSettingsValidator from 'App/Validators/UpdateScheduleSettingsValidator'
import ScheduleSettingsService from 'App/Services/ScheduleSettingsService'

export default class ScheduleSettingsController {
  public async store({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateScheduleSettingsValidator)

    const scheduleSettings = await ScheduleSettingsService.store({
      ...request.only([
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'doctor_id',
      ]),
      tenant_id: auth.user!.tenant_id,
    })

    return response.status(201).json(scheduleSettings)
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(UpdateScheduleSettingsValidator)

    const { id } = params
    const data = request.only([
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'doctor_id',
    ])
    const scheduleSettings = await ScheduleSettingsService.update(
      id,
      auth.user!.tenant_id,
      data
    )

    return response.status(200).json(scheduleSettings)
  }

  public async index({ auth, response }: HttpContextContract): Promise<void> {
    const scheduleSettings = await ScheduleSettingsService.getAll(
      auth.user!.tenant_id
    )

    return response.status(200).json(scheduleSettings)
  }

  public async show({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params
    const scheduleSettings = await ScheduleSettingsService.find(
      id,
      auth.user!.tenant_id
    )

    return response.status(200).json(scheduleSettings)
  }

  public async destroy({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    await ScheduleSettingsService.destroy(params.id, auth.user!.tenant_id)
    return response.status(200).json({ success: true })
  }
}
