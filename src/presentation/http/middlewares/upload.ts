import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Request } from 'express'

const uploadDir = path.join(__dirname, '../../../../uploads')

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = [
        'text/csv',
        'text/plain',
        'application/vnd.ms-excel',
        'application/xml',
        'text/xml',
    ]

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error(`Type of files not suported: ${allowedMimes.join(', ')}`))
    }
}

export const uploadMiddleware = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
}).array('files', 200)
