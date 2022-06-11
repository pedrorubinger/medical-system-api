import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HAS_NO_PERMISSION_CODE } from '../../../utils/constants/errors'
import MyPatientService from 'App/Services/MyPatientService'
import UpdatePatientValidator from 'App/Validators/UpdatePatientValidator'

export default class MyPatientController {
  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params
    const tenantId = auth.user!.tenant_id
    const doctorId = auth.user?.doctor?.id

    if (!doctorId) {
      return response.status(401).json(HAS_NO_PERMISSION_CODE)
    }

    const data = request.only([
      'height',
      'weight',
      'notes',
      'allergies',
      'illnesses',
    ])
    const payload = { ...data, doctor_id: doctorId }

    await request.validate(UpdatePatientValidator)

    const patient = await MyPatientService.update(id, tenantId, payload)

    return response.status(200).json(patient)
  }

  public async index({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const {
      name,
      cpf,
      email,
      motherName,
      primaryPhone,
      order,
      orderBy,
      page,
      perPage,
    } = request.qs()
    const doctorId = auth.user!.doctor?.id
    const params = {
      name,
      cpf,
      email,
      motherName,
      primaryPhone,
      order,
      orderBy,
      page,
      perPage,
    }
    const patients = await MyPatientService.index(
      auth.user!.tenant_id,
      doctorId,
      params
    )

    return response.status(200).json(patients)
  }
}
