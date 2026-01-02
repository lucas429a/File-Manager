import fs from 'fs'
import { ConverterFactory, ConverterType } from '../../factories/ConverterFactory'

export class FileParser {
    async readAndParseFile(file: Express.Multer.File, args: ConverterType) {
        try {
            const fileContent = await fs.promises.readFile(file.path, 'utf8')
            const converter = ConverterFactory.getConverter({
                typeTag: args.typeTag.trim().toLowerCase(),
                codeCompany: Number(args.codeCompany),
            })

            if (Number(args.codeCompany) === ConverterFactory.diGaspiCode) {
                const fileName = file.originalname
                const n_pedido = fileName.split('.')[0]
                const parsedData = converter.parse({ csvData: fileContent, n_pedido })
                return { parsedData, converterType: args }
            }

            const isRiachuelo = Number(args.codeCompany) === ConverterFactory.riachueloCode
            const isBesni = Number(args.codeCompany) === ConverterFactory.besniCode
            const isAvenida = Number(args.codeCompany) === ConverterFactory.avenidaCode
            const isPernambucanas = Number(args.codeCompany) === ConverterFactory.pernambucanasCode
            const isCeA = Number(args.codeCompany) === ConverterFactory.ceaCode

            let parsedData
            if (isRiachuelo || isBesni || isAvenida) {
                parsedData = await converter.parse({ xmlData: fileContent })
            } else if (isPernambucanas || isCeA) {
                parsedData = await converter.parse({ fixedWidthData: fileContent })
            } else {
                parsedData = await converter.parse({ csvData: fileContent })
            }

            return { parsedData, converterType: args }
        } catch (error: any) {
            throw new Error(`Errir to process file: ${error.message}`)
        } finally {
            try {
                await fs.promises.unlink(file.path)
            } catch (error: any) {
                console.warn(`Could not remove temporary file ${file.path} : ${error.message}`)
            }
        }
    }
}
