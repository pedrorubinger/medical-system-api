import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { TENANT_NAME } from '../../../utils/constants/tenant'
import AddressService from 'App/Services/AddressService'
import CreateAddressValidator from 'App/Validators/CreateAddressValidator'
import UpdateAddressValidator from 'App/Validators/UpdateAddressValidator'

export default class AddressController {
  public async store({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(CreateAddressValidator)

    const data = {
      ...request.only([
        'street',
        'number',
        'neighborhood',
        'complement',
        'postal_code',
        'patient_id',
      ]),
      [TENANT_NAME]: auth.user!.tenant_id,
    }
    const address = await AddressService.store(data)

    return response.status(201).json(address)
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    await request.validate(UpdateAddressValidator)

    const { id } = params
    const data = request.only([
      'street',
      'number',
      'neighborhood',
      'complement',
      'postal_code',
    ])
    const address = await AddressService.update(id, auth.user!.tenant_id, data)

    return response.status(200).json(address)
  }

  public async index({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const {
      street,
      number,
      neighborhood,
      postalCode,
      order,
      orderBy,
      page,
      perPage,
    } = request.qs()
    const params = {
      street,
      number,
      neighborhood,
      postalCode,
      order,
      orderBy,
      page,
      perPage,
    }
    const addresses = await AddressService.getAll(auth.user!.tenant_id, params)

    return response.status(200).json(addresses)
  }

  public async show({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    const { id } = params
    const address = await AddressService.find(id, auth.user!.tenant_id)

    return response.status(200).json(address)
  }

  public async destroy({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<void> {
    await AddressService.destroy(params.id, auth.user!.tenant_id)
    return response.status(200).json({ success: true })
  }
}
