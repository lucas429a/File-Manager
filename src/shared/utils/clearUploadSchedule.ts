import cron from 'node-cron'
import { clearUploadsFolder } from './clearUploadFolder'

export function scheduleClearUploads(): void {
    // Limpar a cada 6 horas
    cron.schedule('0 */6 * * *', async () => {
        console.log('inicalizating clear on upload folder...')
        await clearUploadsFolder()
        console.log('Uploads folder cleaning completed.')
    })
}
