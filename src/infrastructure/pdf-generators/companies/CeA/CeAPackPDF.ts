import fs from 'fs'
import path from 'path'

import { CeAFonts } from '../../../../fonts/CeA/CeA.Fonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { CeAPackData } from '../../../converters/companies/CeA/CeAPackConverter'
import { CeAPackTemplate } from '../../templates/companies/CeA/CeAPack.Template'
import { barcodes, multiVariableText, rectangle, text } from '@pdfme/schemas'
import { generate } from '@pdfme/generator'

const fontLoader = new CeAFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new CeAPackTemplate()
const template = TemplateLoader.getTemplate()

export class CeAPackPDF implements IPDFGenerator {
    private prepareInputs(data: CeAPackData[]): any[] {
        return data.map(item => {
            return {
                PACK: 'PACK',
                PACK1: 'PACK  -',
                CMS2: JSON.stringify({ CMS2: item.CENTRO_FATURAMENTO.slice(0, 2) }),
                N_PEDIDO: JSON.stringify({ N_PEDIDO: item.CODIGO_MASTER }),
                IT: JSON.stringify({ IT: item.ITEM }),
                IT2: JSON.stringify({ IT2: item.ITEM }),
                DA1: JSON.stringify({ DA1: item.DES_AUXILIAR_1 }),
                DA2: JSON.stringify({ DA2: item.DES_AUXILIAR_2 }),
                CODBAR: item.CENTRO_FATURAMENTO,
                SUB: JSON.stringify({ SUB: `${item.CENTRO_FATURAMENTO.slice(-3)} -` }),
                CMS: JSON.stringify({ CMS: item.CENTRO_FATURAMENTO }),
                GR1: JSON.stringify({ GR1: `- ${item.DESCRICAO} PEÇAS` }),
            }
        })
    }

    public async generate(outputFileName: string, data: CeAPackData[]): Promise<Buffer> {
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
                    ...barcodes,
                    text,
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
