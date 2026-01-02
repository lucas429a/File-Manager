import fs from 'fs'

export class FileDetectorRiachuelo {
    static async detectFileType(file: Express.Multer.File) {
        const content = await fs.promises.readFile(file.path, 'utf8')

        if (content.includes('<PedidoRiac') && content.includes('TipoEtiqueta="4"')) {
            return 'volume'
        }
        if (content.includes('<PedidoRiac') && content.includes('TipoEtiqueta="5"')) {
            return 'price'
        }
        if (content.includes('<PedidoRiac') && content.includes('TipoEtiqueta="99"')) {
            return 'sku'
        }

        throw new Error('File of type Riachuelo not valid')
    }
}
