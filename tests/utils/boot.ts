import mysql from 'mysql'
require('dotenv').config()

const credentials = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: Number(process.env.MYSQL_PORT),
  host: process.env.MYSQL_HOST,
}

const restartDatabases = async (connection: mysql.Connection) => {
  const defaultDbName = process.env.MYSQL_TEST_DB_NAME || 'medical_test'
  const dropDbSql = `DROP DATABASE IF EXISTS ${defaultDbName}`
  const createDbSql = `CREATE DATABASE ${defaultDbName}`

  await new Promise((resolve, reject) => {
    connection.query(dropDbSql, function (err) {
      if (err) {
        return reject(
          `[DATABASE] An error has occurred trying to drop the test database: ${err}`
        )
      }

      console.log('[DATABASE] Test database has been dropped successfully!')

      connection.query(createDbSql, function (err) {
        if (err) {
          return reject(
            `[DATABASE] An error has occurred trying to create the test database: ${err}`
          )
        }

        console.log('[DATABASE] Test database has been created successfully!')
        resolve(true)
      })
    })
  })
}

export const startTestDatabaseConnection = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'testing') {
    return
  }

  const connection = mysql.createConnection(credentials)

  try {
    connection.connect()
    console.log('[DATABASE] Test database connected successfully!')
    await restartDatabases(connection)
  } catch (err) {
    console.log('[DATABASE] Error trying to connect to test database:', err)
  }
}
