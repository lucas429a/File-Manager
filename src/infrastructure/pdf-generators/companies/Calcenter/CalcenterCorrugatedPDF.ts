import fs from 'node:fs'
import { CSVData } from '../../../converters/companies/Calcenter/CorrugatedConverter'
import { barcodes, rectangle, multiVariableText, text } from '@pdfme/schemas'
import { generate } from '@pdfme/generator'
import { CalcenterCorrugadoFonts } from '../../../../fonts/calcenter/CalcenterCorrugado.Fonts'
import { CalcenterCorrugadoTemplate } from '../../templates/companies/Calcenter/CalcenterCorrugated.Templates'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import path from 'node:path'

const fontLoader = new CalcenterCorrugadoFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new CalcenterCorrugadoTemplate()
const template = TemplateLoader.getTemplate()

export class CalcenterCorrugadoPDF implements IPDFGenerator {
    private prepareInputs(data: CSVData[]): any[] {
        return data.map(item => ({
            'Volume:': 'Volume:',
            'Total:': 'Total:',
            'Descrição:': 'Descrição:',
            'pedido:': 'Pedido:',
            'Semana CD:': 'Semana CD:',
            'Cód. Master:': 'Cód. Master:',
            'Cor:': 'Cor:',
            'N PEDIDO': JSON.stringify({ 'N PEDIDO': item['N PEDIDO'] }),
            'CODIGO MASTER': JSON.stringify({ 'CODIGO MASTER': item['CODIGO MASTER'] }),
            'GRADE QTD': JSON.stringify({ 'GRADE QTD': item['GRADE QTD'] }),
            TOTAL: JSON.stringify({ TOTAL: item.TOTAL }),
            GRADE: JSON.stringify({ GRADE: item.GRADE }),
            VOLUME: JSON.stringify({ VOLUME: item.VOLUME }),
            UC: JSON.stringify({ UC: item.UC }),
            DEPARTAMENTO: JSON.stringify({ DEPARTAMENTO: item.DEPARTAMENTO }),
            FORNECEDOR: JSON.stringify({ FORNECEDOR: item.FORNECEDOR.slice(0, 26) }),
            EMPRESA: JSON.stringify({ EMPRESA: item.EMPRESA }),
            COR: JSON.stringify({ COR: item.COR }),
            DESCRICAO: JSON.stringify({ DESCRICAO: item.DESCRICAO }),
            SEMANA: JSON.stringify({ SEMANA: item.SEMANA }),
            ANO: JSON.stringify({ ANO: `/${item.ANO}` }),
            qrCode: item.UC,
        }))
    }

    public async generate(outputFileName: string, data: CSVData[], quantity?: number): Promise<Buffer> {
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
                    rectangle,
                    multiVariableText,
                    text,
                    qrCode: barcodes.qrcode,
                },
                options: { font: font as any },
            })

            console.log(`PDF generated successfully: ${filePath}`)
            fs.writeFileSync(filePath, pdf)
            return Buffer.from(pdf)
        } catch (error) {
            console.error('Error generating PDF:', error)
            throw new Error('Failed to generate PDF: ' + (error as Error).message)
        }
    }
}
