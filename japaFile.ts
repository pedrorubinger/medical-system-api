import 'reflect-metadata'
import execa from 'execa'
import { join } from 'path'
import getPort from 'get-port'
import { configure } from 'japa'
import sourceMapSupport from 'source-map-support'
import { startTestDatabaseConnection } from './tests/utils/boot'

process.env.NODE_ENV = 'testing'
process.env.ADONIS_ACE_CWD = join(__dirname)
sourceMapSupport.install({ handleUncaughtExceptions: false })

export async function runMigrations() {
  await execa.node('ace', ['migration:run'], {
    stdio: 'inherit',
  })
}

export async function runSeeds() {
  await execa.node('ace', ['db:seed'], {
    stdio: 'inherit',
  })
}

export async function rollbackMigrations() {
  await execa.node('ace', ['migration:rollback', '--batch=0'], {
    stdio: 'inherit',
  })
}

async function startHttpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')

  process.env.PORT = String(await getPort())
  await new Ignitor(__dirname).httpServer().start()
}

function getTestFiles() {
  let userDefined = process.argv.slice(2)[0]

  if (!userDefined) {
    return 'tests/**/*.spec.ts'
  }

  return `${userDefined.replace(/\.ts$|\.js$/, '')}.ts`
}

/**
 * Configure test runner
 */
configure({
  files: getTestFiles(),
  before: [startTestDatabaseConnection, startHttpServer],
})
