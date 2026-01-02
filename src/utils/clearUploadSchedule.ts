import { error } from 'console'
import { clearUploadsFolder } from './clearUploadFolder'

const thirtySeconds = 30 * 1000

console.log('Iniciando limpeza automática a cada 30 segundos...')

clearUploadsFolder().catch(error => console.error('Erro na primeira execução : ', error))

setInterval(() => {
    console.log('Limpando a pasta /uploads...')
    clearUploadsFolder()
}, thirtySeconds)
