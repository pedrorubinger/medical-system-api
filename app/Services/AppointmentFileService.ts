import Drive from '@ioc:Adonis/Core/Drive'
import Database from '@ioc:Adonis/Lucid/Database'
import { v4 as uuidv4 } from 'uuid'

import { TENANT_NAME } from '../../utils/constants/tenant'
import AppError from 'App/Exceptions/AppError'
import Appointment from 'App/Models/Appointment'
import AppointmentFile from 'App/Models/AppointmentFile'

interface AppointmentFileData {
  appointmentId: number
  files: Array<any> /* the file type is MultipartFileContract */
}

interface StoreFileResponse {
  signedUrl: string
  filePath: string
}

interface DestroyFileResponse {
  total: number
  deleted: number
}

/** TO DO: Evaluate ways to implement transactions
 * between Cloud Storage and the database.
 */
class AppointmentFileService {
  private async storeFile(
    doctor_id: number,
    file: any,
    name: string
  ): Promise<StoreFileResponse> {
    try {
      const location = `doctor_${doctor_id}_appointments`
      const filePath = `${location}/${name || new Date().getTime()}`

      console.log(
        'AppointmentFileService > storeFile > location and filePath:',
        location,
        filePath
      )
      console.log(
        'AppointmentFileService > storeFile > going to move to disk',
        location,
        { name },
        'gcs'
      )
      await file.moveToDisk(location, { name }, 'gcs')

      console.log(
        'AppointmentFileService > storeFile > moved to disk',
        location,
        { name },
        'gcs'
      )
      const signedUrl = await Drive.getSignedUrl(filePath)

      return { signedUrl, filePath }
    } catch (err) {
      console.log('AppointmentFileService > storeFile > err:', err)
      throw new AppError(
        err?.message,
        err?.code || 'STORE_APPOINTMENT_FILE_FAILED',
        err?.status
      )
    }
  }

  public async store(
    data: AppointmentFileData,
    doctorId: number,
    tenantId: number
  ): Promise<AppointmentFile[]> {
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
      console.log('AppointmentFileService > store > err:', err)
      throw new AppError(err?.message, err?.code, err?.status)
    }

    console.log('GOING TO GET THE FILE dev_test_one')

    const signed = await Drive.getSignedUrl('test/dev_test_one')

    console.log('SIGNED dev_test_one', signed)
    /** NOTE:
     * It m̶i̶g̶h̶t̶  will not work. Must be considered implementing another solution to
     * use transaction between GCS and the database.
     */
    return await Database.transaction(async (trx) => {
      try {
        const result: AppointmentFile[] = []

        for (const file of data.files) {
          const path = `${new Date().getTime()}_${uuidv4()}`
          console.log(
            'AppointmentFileService > store > dataBase trx path:',
            path
          )
          console.log(
            'AppointmentFileService > store > dataBase trx file:',
            file
          )
          const storedFile = await this.storeFile(doctorId, file, path)
          const appointmentFile = await AppointmentFile.create({
            appointment_id: data.appointmentId,
            file_url: storedFile.signedUrl,
            file_path: storedFile.filePath,
            file_name: file.clientName,
            [TENANT_NAME]: tenantId,
          })

          result.push(appointmentFile)
        }

        if (!result.length) {
          throw new Error()
        }

        return result
      } catch (err) {
        await trx.rollback()
        console.log(
          'AppointmentFileService > store > database transaction > err:',
          err
        )
        throw new AppError(err?.message, err?.code, err?.status)
      }
    })
  }

  public async findByAppointmentId(
    appointmentId: number,
    tenantId: number
  ): Promise<AppointmentFile[]> {
    try {
      const appointmentFiles = await AppointmentFile.query()
        .where(TENANT_NAME, '=', tenantId)
        .andWhere('appointment_id', '=', appointmentId)

      if (!appointmentFiles) {
        return []
      }

      return appointmentFiles
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }

  public async destroy(
    id: number,
    tenantId: number,
    all = false
  ): Promise<DestroyFileResponse> {
    try {
      const none = { total: 0, deleted: 0 }

      /** Destroy all records */
      if (['1', 'true'].includes(all?.toString())) {
        const appointmentFiles = await AppointmentFile.query()
          .where(TENANT_NAME, '=', tenantId)
          .andWhere('appointment_id', '=', id)

        const paths = appointmentFiles.map(
          (appointment) => appointment.file_path
        )

        if (!paths?.length) {
          return none
        }

        let deletedFiles = 0

        for (const path of paths) {
          const appointment = appointmentFiles.find(
            (appointment) => appointment.file_path === path
          )

          if (!appointment) {
            continue
          }

          await Drive.delete(path)
          await appointment.delete()
          deletedFiles++
        }

        return { total: paths.length, deleted: deletedFiles }
      } else {
        const appointmentFile = await AppointmentFile.find(id)

        if (!appointmentFile) {
          return none
        }

        await Drive.delete(appointmentFile.file_path)
        await appointmentFile.delete()
        return { total: 1, deleted: 1 }
      }
    } catch (err) {
      throw new AppError(err?.message, err?.code, err?.status)
    }
  }
}

export default new AppointmentFileService()
