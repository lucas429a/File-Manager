import path from 'path'
import fs from 'fs'
import { DiSantinniPackFonts } from '../../../../fonts/DiSantinni/DiSantinniPack.Fonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { DiSantinniPackData } from '../../../converters/companies/DiSantini/DiSantiniPackConverter'
import { DiSantinniPackTemplate } from '../../templates/companies/DiSantinni/DiSantiPack.Template'
import { generate } from '@pdfme/generator'
import { barcodes, line, multiVariableText } from '@pdfme/schemas'

const fontLoader = new DiSantinniPackFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new DiSantinniPackTemplate()
const template = TemplateLoader.getTemplate()

export class DiSantinniPackPDF implements IPDFGenerator {
    private prepareInputs(data: DiSantinniPackData[]): any[] {
        return data.map(item => {
            return {
                UC: JSON.stringify({ UC: item.uc }),
                DEPARTAMENTO: JSON.stringify({ DEPARTAMENTO: item.referencia }),
                DESCRICAO: JSON.stringify({ DESCRICAO: item.descricao }),
                COR: JSON.stringify({ COR: item.cor }),
                GRADE: JSON.stringify({ GRADE: item.grade }),
                GRADE_QTD: JSON.stringify({ GRADE_QTD: item.gradeQuantidades }),
                codBarra: item.codigoSku,
            }
        })
    }

    public async generate(outputFileName: string, data: DiSantinniPackData[]): Promise<Buffer> {
        const inputs = this.prepareInputs(data)
        const uploadsDir = path.resolve(__dirname, '../../../../uploads')

        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true })
        }

        const filePath = path.join(uploadsDir, outputFileName)

        try {
            const pdf = await generate({
                template,
                inputs,
                plugins: {
                    line,
                    barcode: barcodes.code39,
                    multiVariableText,
                },
                options: { font: font as any },
            })
            fs.writeFileSync(filePath, pdf)
            return Buffer.from(pdf)
        } catch (error) {
            console.error('Error generating PDF:', error)
            throw new Error('Failed to generate PDF: ' + (error as Error).message)
        }
    }
}
