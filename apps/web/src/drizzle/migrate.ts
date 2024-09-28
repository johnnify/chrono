import {runMigration} from './runMigration'
import {scriptClient} from './scriptDb'

await runMigration()
scriptClient.close()
