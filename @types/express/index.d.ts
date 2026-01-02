import { IUserReturn } from '../../src/modules/user/prisma/User.repository'

declare global {
    declare namespace Express {
        export interface Request {
            user: any
        }
    }
}
