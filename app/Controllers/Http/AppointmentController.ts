import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import AppointmentService from 'App/Services/AppointmentService'
import CreateAppointmentValidator from 'App/Validators/CreateAppointmentValidator'
import UpdateAppointmentValidator from 'App/Validators/UpdateAppointmentValidator'

export default class AppointmentController {
  public async store({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateAppointmentValidator)

    const data = {
      ...request.only([
        'datetime',
        'is_follow_up',
        'notes',
        'exam_request',
        'prescription',
        'is_private',
        'tenant_id',
        'patient_id',
        'doctor_id',
        'insurance_id',
        'specialty_id',
        'payment_method_id',
      ]),
      tenant_id: auth.user!.tenant_id,
    }
    const appointment = await AppointmentService.store(data)

    return response.status(201).json(appointment)
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(UpdateAppointmentValidator)

    const { id } = params
    const data = request.only([
      'datetime',
      'is_follow_up',
      'notes',
      'status',
      'exam_request',
      'prescription',
      'is_private',
      'tenant_id',
      'patient_id',
      'doctor_id',
      'insurance_id',
      'specialty_id',
      'payment_method_id',
    ])
    const files = request.files('files')
    const appointment = await AppointmentService.update(
      id,
      auth.user!.tenant_id,
      { ...data, doctor_id: auth.user?.doctor?.id, files }
    )

    return response.status(200).json(appointment)
  }

  public async index({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const isDoctor = !!auth?.user?.doctor?.id
    const {
      date,
      status,
      datetime,
      doctor,
      patientId,
      order,
      orderBy,
      page,
      perPage,
    } = request.qs()
    const params = {
      date,
      datetime,
      doctor,
      patientId,
      order,
      orderBy,
      status,
      page,
      perPage,
    }
    const appointments = await AppointmentService.getAll(
      auth.user!.tenant_id,
      isDoctor,
      params
    )

    return response.status(200).json(appointments)
  }

  public async show({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params
    const appointment = await AppointmentService.find(id, auth.user!.tenant_id)

    return response.status(200).json(appointment)
  }

  public async findLastAppointment({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const { patientId, doctorId } = request.qs()

    if (!patientId || !doctorId) {
      return response
        .status(404)
        .json({ code: 'MISSING_PATIENT_AND_DOCTOR_ID' })
    }

    const isDoctor = !!auth?.user?.doctor?.id
    const lastAppointment = await AppointmentService.findLastAppointment(
      patientId,
      auth.user!.tenant_id,
      doctorId,
      isDoctor
    )

    return response.status(200).json(lastAppointment)
  }

  public async destroy({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    await AppointmentService.destroy(params.id, auth.user!.tenant_id)
    return response.status(200).json({ success: true })
  }
}
