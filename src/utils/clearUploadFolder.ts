import fs from 'fs'
import path from 'path'

const uploadsFolderPath = path.join(__dirname, '../../uploads')

export async function clearUploadsFolder() {
    try {
        if (!fs.existsSync(uploadsFolderPath)) {
            return
        }

        const files = await fs.promises.readdir(uploadsFolderPath)

        if (files.length === 0) {
            return
        }

        for (const file of files) {
            const filePath = path.join(uploadsFolderPath, file)
            await fs.promises.unlink(filePath)
        }
    } catch (error: any) {
        console.error('Erro ao limpar pasta uploads:', error)
    }
}
