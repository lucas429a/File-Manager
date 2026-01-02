import fs from 'fs'
import path from 'path'

import { AvenidaPackFonts } from '../../../../fonts/Avenida/AvenidaPack.Fonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { AvenidaTagData } from '../../../converters/companies/Avenida/AvenidaTagConverter'
import { AvenidaPackTemplate } from '../../templates/companies/Avenida/AvenidaPack.Template'
import { generate } from '@pdfme/generator'
import { barcodes, multiVariableText, rectangle, text } from '@pdfme/schemas'

const fontLoader = new AvenidaPackFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new AvenidaPackTemplate()
const template = TemplateLoader.getTemplate()

export class AvenidaPackPDF implements IPDFGenerator {
    private prepareInputs(data: AvenidaTagData[]): any[] {
        const today = new Date()
        return data.map(item => {
            return {
                CODIGO: 'Codigo :',
                PACK: 'Pack :',
                Pedido: 'Pedido:',
                'Ped./ CD:': 'Ped./ CD:',
                'Entrega:': 'Entrega:',
                QTD: 'Qtd',
                UC: JSON.stringify({ UC: item.UC }),
                VOLUME: JSON.stringify({ VOLUME: item.VOLUME }),
                DESCRICAO: JSON.stringify({ DESCRICAO: item.DESCRICAO }),
                COD_DCO: JSON.stringify({ COD_DCO: item.COD_DCO }),
                DEPARTAMENTO: JSON.stringify({ DEPARTAMENTO: item.DEPARTAMENTO }),
                N_PEDIDO: JSON.stringify({ N_PEDIDO: item.N_PEDIDO }),
                CODIGO_DIGITO: JSON.stringify({ CODIGO_DIGITO: item.CODIGO_DIGITO }),
                FAIXA: JSON.stringify({ FAIXA: item.FAIXA }),
                DES_AUXILIAR_1: JSON.stringify({
                    DES_AUXILIAR_1: ` / ${item.DES_AUXILIAR_1}`,
                }),
                DES_ENDERECO: JSON.stringify({ DES_ENDERECO: item.DES_ENDERECO }),
                FORNECEDOR: JSON.stringify({
                    FORNECEDOR: item.FORNECEDOR.slice(0, 26),
                }),
                QTD_TOTAL: JSON.stringify({ QTD_TOTAL: item.QTD_TOTAL }),
                CICLOVIDA: JSON.stringify({ CICLOVIDA: item.CICLOVIDA }),
                BARCODE: item.UC + 0 + item.VOLUME,
                TODAY: JSON.stringify({ TODAY: this.formatData(today) }),
            }
        })
    }

    public async generate(outputFileName: string, data: AvenidaTagData[], quantity?: number): Promise<Buffer> {
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
                    barcode: barcodes.code128,
                    text,
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

    private formatData(date: Date): string {
        const pad = (n: number) => String(n).padStart(2, '0')

        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ` + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    }
}
