import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import { errorHandler } from './middlewares/errorHandler'
import { setupRoutes } from './routes'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../../uploads')
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['text/csv', 'text/plain', 'application/vnd.ms-excel', 'application/xml', 'text/xml']

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error(`types allowed: ${allowedMimes.join(', ')}`))
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
}).array('files', 200)

export function createServer(): Application {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(
        cors({
            origin: '*',
            methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        })
    )

    setupRoutes(app)

    app.use(errorHandler)

    return app
}

export function startServer(port: number): void {
    const app = createServer()

    app.listen(port, () => {
        console.log(`🚀 Server is running on PORT ${port}`)
        console.log(`📚 API available at: http://localhost:${port}`)
    })
}
