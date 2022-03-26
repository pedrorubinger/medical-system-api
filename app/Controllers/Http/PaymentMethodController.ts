import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreateOrUpdatePaymentMethodValidator from 'App/Validators/CreateOrUpdatePaymentMethodValidator'
import PaymentMethodService from 'App/Services/PaymentMethodService'

export default class PaymentMethodController {
  public async store({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateOrUpdatePaymentMethodValidator)

    const data = { ...request.only(['name']), tenant_id: auth.user!.tenant_id }
    const paymentMethod = await PaymentMethodService.store(data)

    return response.status(201).json(paymentMethod)
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateOrUpdatePaymentMethodValidator)

    const { id } = params
    const data = request.only(['name'])
    const paymentMethod = await PaymentMethodService.update(
      id,
      auth.user!.tenant_id,
      data
    )

    return response.status(200).json(paymentMethod)
  }

  public async index({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const { name, order, orderBy, page, perPage } = request.qs()
    const params = {
      name,
      order,
      orderBy,
      page,
      perPage,
    }
    const paymentMethods = await PaymentMethodService.getAll(
      auth.user!.tenant_id,
      params
    )

    return response.status(200).json(paymentMethods)
  }

  public async show({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params
    const paymentMethod = await PaymentMethodService.find(
      id,
      auth.user!.tenant_id
    )

    return response.status(200).json(paymentMethod)
  }

  public async destroy({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    await PaymentMethodService.destroy(params.id, auth.user!.tenant_id)
    return response.status(200).json({ success: true })
  }
}
