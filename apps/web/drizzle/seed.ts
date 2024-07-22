import {runSeed} from './runSeed'
import {scriptClient} from './scriptDb'

await runSeed()
scriptClient.close()
