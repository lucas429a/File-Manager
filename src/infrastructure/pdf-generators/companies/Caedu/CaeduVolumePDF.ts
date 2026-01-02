import fs from 'fs'
import path from 'path'
import { CaeduFonts } from '../../../../fonts/Caedu/Caedu.Fonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { CaeduVolumeData } from '../../../converters/companies/Caedu/CaeduVolumeConverter'
import { CaeduVolumeTemplate } from '../../templates/companies/Caedu/CaeduVolume.Template'
import { generate } from '@pdfme/generator'
import { barcodes, line, multiVariableText, rectangle, text } from '@pdfme/schemas'

const fontLoader = new CaeduFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new CaeduVolumeTemplate()
const template = TemplateLoader.getTemplate()

export class CaeduVolumePDF implements IPDFGenerator {
    private prepareInputs(data: CaeduVolumeData[]): any[] {
        return data.map(item => {
            const value = parseInt(item.VOLUME.slice(0, 3), 10)
            return {
                Pedido: 'Pedido',
                NF: 'NF',
                Produto: 'Produto',
                VolumeT: 'Volume',
                N_PEDIDO: JSON.stringify({ N_PEDIDO: item.N_PEDIDO }),
                N_P: JSON.stringify({ N_P: item.N_PEDIDO }),
                FORNECEDOR: JSON.stringify({ FORNECEDOR: item.FORNECEDOR }),
                GRADE: JSON.stringify({ GRADE: item.GRADE }),
                COR: JSON.stringify({ COR: item.COR }),
                GRADE_QTD: JSON.stringify({ GRADE_QTD: item.GRADE_QTD }),
                CODIGO_MATERIAL1: JSON.stringify({ CODIGO_MATERIAL1: item.CODIGO_MATERIAL_SKU.slice(0, 8) }),
                DESCRICAO: JSON.stringify({ DESCRICAO: item.DESCRICAO }),
                CF: JSON.stringify({ CF: item.CENTRO_FATURAMENTO }),
                COD_MAT2: JSON.stringify({ COD_MAT2: item.CODIGO_MATERIAL_SKU.slice(0, 8) }),
                VOLUME: JSON.stringify({ VOLUME: item.VOLUME }),
                QRCODE: `${item.CENTRO_FATURAMENTO}|${item.CODIGO_MATERIAL_SKU.slice(0, 8)}|${item.N_PEDIDO}|${value}`,
            }
        })
    }

    public async generate(outputFileName: string, data: CaeduVolumeData[], quantity?: number): Promise<Buffer> {
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
                    barcode: barcodes.qrcode,
                    text,
                    line,
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
