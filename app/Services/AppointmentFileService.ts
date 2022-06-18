import Drive from '@ioc:Adonis/Core/Drive'
import Database from '@ioc:Adonis/Lucid/Database'
import { v4 as uuidv4 } from 'uuid'

import { TENANT_NAME } from '../../utils/constants/tenant'
import AppError from 'App/Exceptions/AppError'
import Appointment from 'App/Models/Appointment'
import AppointmentFile from 'App/Models/AppointmentFile'

interface AppointmentFileData {
  appointmentId: number
  file: any /* the file type is MultipartFileContract */
}

interface StoreFileResponse {
  signedUrl: string
  filePath: string
}

/** TO DO: Evaluate ways to implement transactions between
 * Cloud Storage and the database.
 * */
class AppointmentFileService {
  private async storeFile(file: any, name: string): Promise<StoreFileResponse> {
    try {
      const location = 'appointments'
      const filePath = `${location}/${name}`

      await file.moveToDisk(location, { name }, 'gcs')

      const signedUrl = await Drive.getSignedUrl(filePath)

      return { signedUrl, filePath }
    } catch (err) {
      throw new AppError(
        err?.message,
        err?.code || 'STORE_APPOINTMENT_FILE_FAILED',
        err?.status
      )
    }
  }

  private async findFileByPath(
    filePath: string
  ): Promise<NodeJS.ReadableStream> {
    try {
      if (!(await Drive.exists(filePath))) {
        throw new Error()
      }

      // return await Drive.get(filePath)
      const stream = await Drive.getStream(filePath)

      return stream
    } catch (err) {
      throw new AppError(
        err?.message,
        err?.code || 'APPOINTMENT_FILE_NOT_FOUND',
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
        }_appointment_file_${new Date().getTime()}_${uuidv4()}.${
          data.file.extname
        }`
        const storedFile = await this.storeFile(data.file, name)

        return await AppointmentFile.create({
          appointment_id: data.appointmentId,
          file_url: storedFile.signedUrl,
          file_path: storedFile.filePath,
          [TENANT_NAME]: tenantId,
        })
      } catch (err) {
        await trx.rollback()
        throw new AppError(err?.message, err?.code, err?.status)
      }
    })
  }

  public async findByAppointmentId(appointmentId: number, tenantId: number) {
    try {
      const appointment = await AppointmentFile.findBy(
        'appointment_id',
        appointmentId
      )

      if (
        !appointment ||
        tenantId.toString() !== appointment.tenant_id.toString()
      ) {
        throw new AppError(
          'This appointment was not found!',
          'APPOINTMENT_NOT_FOUND',
          404
        )
      }

      console.log('result:', await this.findFileByPath(appointment.file_path))
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new AppointmentFileService()
