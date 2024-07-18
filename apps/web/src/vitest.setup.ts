import {beforeAll, afterEach, afterAll} from 'vitest'

import {mswNodeServer} from './mocks/mswNodeServer'

beforeAll(() => mswNodeServer.listen())
afterEach(() => mswNodeServer.resetHandlers())
afterAll(() => mswNodeServer.close())
