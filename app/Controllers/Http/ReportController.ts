import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ReportSevice from 'App/Services/ReportSevice'

export default class ReportController {
  public async index({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<void> {
    const tenantId = auth.user!.tenant_id
    const { doctorId, permission, initialDate, finalDate } = request.qs()
    const params = {
      doctorId,
      permission,
      initialDate,
      finalDate,
      tenantId,
    }
    const reports = await ReportSevice.getAll({ ...params })

    return response.status(200).json(reports)
  }
}
