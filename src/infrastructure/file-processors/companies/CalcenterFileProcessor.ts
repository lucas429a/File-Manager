import { TagDataService } from '../../services/data/TagDataService'
import { CSVData } from '../../converters/companies/Calcenter/CorrugatedConverter'
import { FileDetectorCalcenter } from '../../converters/companies/Calcenter/FileDecectorCalcenter'
import { CSVDataFrontBox } from '../../converters/companies/Calcenter/FrontBoxConverter'
import { CSVDataInsole } from '../../converters/companies/Calcenter/InsoleConverter'
import { FileProcessorBase } from '../base/FileProcessorBase'
import { FileParser } from '../utils/FileParser'

export class CalcenterFileProcessor extends FileProcessorBase {
    private tagDataService = new TagDataService()
    private fileParser = new FileParser()

    async processFiles(files: any, companyCode: number) {
        const organizedFiles = await this.organizeFiles(files)

        const [corrugadoResult, frontBoxResult, palmilhaResult] = await Promise.all([
            this.fileParser.readAndParseFile(organizedFiles.corrugado, { typeTag: 'corrugado', codeCompany: companyCode }),
            this.fileParser.readAndParseFile(organizedFiles.frontbox, { typeTag: 'frontbox', codeCompany: companyCode }),
            this.fileParser.readAndParseFile(organizedFiles.palmilha, { typeTag: 'palmilha', codeCompany: companyCode }),
        ])

        const corrugadoData = corrugadoResult.parsedData as CSVData[]
        const frontBoxData = frontBoxResult.parsedData as CSVDataFrontBox[]
        const palmilhaData = palmilhaResult.parsedData as CSVDataInsole[]

        const mergeData = this.mergeData(corrugadoData, frontBoxData, palmilhaData)
        const saveResult = await this.tagDataService.saveToTagsTable(mergeData, companyCode, 'corrugado', 'frontbox', 'palmilha')

        return saveResult
    }
    async organizeFiles(files: Express.Multer.File[]) {
        const organizedFiles: { [key: string]: Express.Multer.File } = {}

        for (const file of files) {
            const fileType = await FileDetectorCalcenter.detectFileType(file)
            organizedFiles[fileType] = file
        }

        if (!organizedFiles.corrugado || !organizedFiles.frontbox || !organizedFiles.palmilha) {
            throw new Error('Is necessary one file type on each type.')
        }

        return organizedFiles
    }

    private mergeData(corrugado: CSVData[], frontBox: CSVDataFrontBox[], palmilha: CSVDataInsole[]): Array<CSVData | CSVDataFrontBox | CSVDataInsole> {
        const mergedData: Array<CSVData | CSVDataFrontBox | CSVDataInsole> = []

        const fillMissingFields = (target: any, source: any) => {
            Object.keys(source).forEach(key => {
                if (!(key in target) && source[key] !== null && source[key] !== '') {
                    target[key] = source[key]
                }
            })
        }

        corrugado.forEach(corrugadoEntry => {
            const codigoMaster = corrugadoEntry['CODIGO MASTER']
            const ultimosTresDigitos = codigoMaster.slice(-3)
            const entry = { ...corrugadoEntry, origem: 'corrugado' } as CSVData

            const frontBoxMatch = frontBox.find(f => f['CODIGO DIGITO'] === ultimosTresDigitos)
            const palmilhaMatch = palmilha.find(p => p['CODIGO MASTER'] === codigoMaster)

            if (frontBoxMatch) fillMissingFields(entry, frontBoxMatch)
            if (palmilhaMatch) fillMissingFields(entry, palmilhaMatch)

            mergedData.push(entry)
        })

        frontBox.forEach(frontBoxEntry => {
            const codigoDigito = frontBoxEntry['CODIGO DIGITO']
            const entry = { ...frontBoxEntry, origem: 'frontbox' } as CSVDataFrontBox

            const corrugadoMatch = corrugado.find(c => c['CODIGO MASTER'].endsWith(codigoDigito))
            const palmilhaMatch = palmilha.find(p => p['CODIGO MASTER'].endsWith(codigoDigito))

            if (corrugadoMatch) fillMissingFields(entry, corrugadoMatch)
            if (palmilhaMatch) fillMissingFields(entry, palmilhaMatch)

            mergedData.push(entry)
        })

        palmilha.forEach((palmilhaEntry, index) => {
            const codigoMaster = palmilhaEntry['CODIGO MASTER']
            const alreadyExists = mergedData.some(
                entry => ('CODIGO_MASTER' in entry && entry['CODIGO_MASTER'] === codigoMaster) || ('CODIGO_DIGITO' in entry && entry['CODIGO_DIGITO'] === codigoMaster.slice(-3)),
            )

            if (!alreadyExists) {
                const entry = { ...palmilhaEntry, origem: 'palmilha' } as CSVDataInsole

                const corrugadoMatch = corrugado.find(c => c['CODIGO MASTER'] === codigoMaster)
                const frontBoxMatch = frontBox.find(f => f['CODIGO DIGITO'] === codigoMaster.slice(-3))

                if (corrugadoMatch) fillMissingFields(entry, corrugadoMatch)
                if (frontBoxMatch) fillMissingFields(entry, frontBoxMatch)

                if (frontBox[index]?.EAN) {
                    entry.EAN = frontBox[index].EAN
                }

                if (frontBox[index]?.['N TAMANHO']) {
                    entry['N TAMANHO'] = frontBox[index]['N TAMANHO']
                }

                mergedData.push(entry)
            }
        })

        return mergedData
    }
}
