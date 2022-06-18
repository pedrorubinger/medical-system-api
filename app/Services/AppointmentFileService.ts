import Drive from '@ioc:Adonis/Core/Drive'
import Database from '@ioc:Adonis/Lucid/Database'

import { TENANT_NAME } from '../../utils/constants/tenant'
import AppError from 'App/Exceptions/AppError'
import Appointment from 'App/Models/Appointment'
import AppointmentFile from 'App/Models/AppointmentFile'

interface AppointmentFileData {
  appointmentId: number
  file: any /* the file type is MultipartFileContract */
}

/** TO DO: Evaluate ways to implement transactions between Cloud Storage and the database. */
class AppointmentFileService {
  public async storeFile(file: any, name: string): Promise<string> {
    try {
      const location = 'appointments'

      await file.moveToDisk(location, { name }, 'gcs')
      return await Drive.getSignedUrl(`${location}/${name}`)
    } catch (err) {
      throw new AppError(
        err?.message,
        err?.code || 'STORE_FILE_FAILED',
        err?.status
      )
    }
  }

  public async store(
    data: AppointmentFileData,
    doctorId: number,
    tenantId: number
  ): Promise<AppointmentFile> {
    try {
      const appointment = await Appointment.find(data.appointmentId)

      if (
        !appointment ||
        tenantId.toString() !== appointment.tenant_id.toString() ||
        doctorId?.toString() !== appointment.doctor_id.toString()
      ) {
        throw new AppError(
          'This appointment was not found!',
          'APPOINTMENT_NOT_FOUND',
          404
        )
      }
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }

    /** NOTE:
     * It might not work. Must be considered implementing another solution to
     * use transaction between GCS and the database.
     */
    return await Database.transaction(async (trx) => {
      try {
        const name = `${
          data.appointmentId
        }_appointment_file_${new Date().getTime()}.${data.file.extname}`
        const signedUrl = await this.storeFile(data.file, name)

        return await AppointmentFile.create({
          appointment_id: data.appointmentId,
          file_url: signedUrl,
          [TENANT_NAME]: tenantId,
        })
      } catch (err) {
        await trx.rollback()
        throw new AppError(err?.message, err?.code, err?.status)
      }
    })
  }
}

export default new AppointmentFileService()
