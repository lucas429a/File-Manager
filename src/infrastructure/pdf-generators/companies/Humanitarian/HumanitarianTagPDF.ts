import path from 'path'
import fs from 'fs'

import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { HumanitarianTagData } from '../../../converters/companies/Humanitarian/HumanitarianConverter'
import { generate } from '@pdfme/generator'
import { barcodes, multiVariableText } from '@pdfme/schemas'
import { HumanitarianTagTemplate } from '../../templates/companies/Humanitarian/Humanitarian.Template'
import { HumanitarianTagFonts } from '../../../../fonts/Humanitarian/HumanitarianTga.Fonts'

const TemplateLoader = new HumanitarianTagTemplate()
const template = TemplateLoader.getTemplate()

const fontLoader = new HumanitarianTagFonts()
const font = fontLoader.getAllFonts()

export class HumanitarianTagPDF implements IPDFGenerator {
    private prepareInputs(data: HumanitarianTagData[]): any[] {
        return data.map(item => {
            return {
                DESCRICAO1: JSON.stringify({ DESCRICAO1: item.DESCRICAO.slice(0, 19) }),
                DESCRICAO2: JSON.stringify({ DESCRICAO2: item.DESCRICAO.slice(0, 19) }),
                COR1: JSON.stringify({ COR1: item.COR }),
                COR2: JSON.stringify({ COR2: item.COR }),
                N_TAMANHO1: JSON.stringify({ N_TAMANHO1: item.N_TAMANHO }),
                N_TAMANHO2: JSON.stringify({ N_TAMANHO2: item.N_TAMANHO }),
                FORNECEDOR1: JSON.stringify({ FORNECEDOR1: item.FORNECEDOR }),
                FORNECEDOR2: JSON.stringify({ FORNECEDOR2: item.FORNECEDOR }),
                CODBAR1: item.EAN,
                CODBAR2: item.EAN,
            }
        })
    }

    public async generate(outputFileName: string, data: HumanitarianTagData[]): Promise<Buffer> {
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
                    barcode: barcodes.code128,
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
