import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateOrUpdateScheduleDaysOffValidator from 'App/Validators/CreateOrUpdateScheduleDaysOffValidator'
import ScheduleDaysOffService from 'App/Services/ScheduleDaysOffService'
import { HAS_NO_PERMISSION_CODE } from '../../../utils/constants/errors'

export default class ScheduleDaysOffController {
  public async store({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateOrUpdateScheduleDaysOffValidator)

    const data = request.only(['datetime_start', 'datetime_end', 'doctor_id'])
    const scheduleDaysOff = await ScheduleDaysOffService.store(
      data,
      auth.user!.tenant_id
    )

    if (scheduleDaysOff.error) {
      return response.status(400).json(scheduleDaysOff.error)
    } else {
      return response.status(201).json(scheduleDaysOff.data)
    }
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateOrUpdateScheduleDaysOffValidator)

    const { id } = params
    const data = request.only(['datetime_start', 'datetime_end'])
    const scheduleDaysOff = await ScheduleDaysOffService.update(
      id,
      auth.user!.tenant_id,
      data
    )

    return response.status(200).json(scheduleDaysOff)
  }

  public async findByDoctorId({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const { doctorId, page, perPage } = request.qs()
    const params = {
      doctorId,
      page,
      perPage,
    }

    if (
      auth?.user?.role === 'doctor' &&
      auth?.user?.doctor?.id?.toString() !== params?.doctorId?.toString()
    ) {
      return response.status(401).json(HAS_NO_PERMISSION_CODE)
    }

    const scheduleDaysOff = await ScheduleDaysOffService.findByDoctorId(
      auth.user!.tenant_id,
      params
    )

    return response.status(200).json(scheduleDaysOff)
  }

  public async destroy({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    await ScheduleDaysOffService.destroy(params.id, auth.user!.tenant_id)
    return response.status(200).json({ success: true })
  }
}
