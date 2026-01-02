import path from 'path'
import fs from 'fs'
import { DiGaspiPriceFonts } from '../../../../fonts/DiGaspi/DiGaspiPrice.Fonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { DiGaspiTagData } from '../../../converters/companies/DiGaspi/DiGaspiTagConverter'
import { DiGaspiPriceTemplate } from '../../templates/companies/DiGaspi/DiGaspiPrice.Template'
import { generate } from '@pdfme/generator'
import { barcodes, image, line, rectangle, text, multiVariableText } from '@pdfme/schemas'
import { fakeLogo } from '../../../../logos/logo'
import { formatCNPJ } from '../../../../shared/utils/formatCNPJ'

const fontLoader = new DiGaspiPriceFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new DiGaspiPriceTemplate()
const template = TemplateLoader.getTemplate()

export class DiGaspiPricePDF implements IPDFGenerator {
    private prepareInputs(data: DiGaspiTagData[]): any[] {
        return data.map(item => {
            const cleanEAN = item.EAN ? item.EAN.trim().replace(/\s+/g, '') : ''
            const formatDoc = formatCNPJ(item.UC)

            return {
                DiGaspiLogo: fakeLogo,
                DiGaspiLogo2: fakeLogo,
                EAN: cleanEAN,
                EAN2: cleanEAN,
                HELPERTEXT: 'Manter Etiqueta em Caso de Troca',
                HELPERTEXT2: 'Manter Etiqueta em Caso de Troca',
                R$: 'R$',
                R$2: 'R$',
                TamanhoHP: 'Tamanho',
                TamanhoHP2: 'Tamanho',
                FORNECEDOR: JSON.stringify({ FORNECEDOR: item.Fornecedor }),
                FORNECEDOR2: JSON.stringify({ FORNECEDOR2: item.Fornecedor }),
                ITEM: JSON.stringify({ ITEM: item.Item }),
                ITEM2: JSON.stringify({ ITEM2: item.Item }),
                DESCRICAO: JSON.stringify({ DESCRICAO: item.Descricao }),
                DESCRICAO2: JSON.stringify({ DESCRICAO2: item.Descricao }),
                SUBSEGMENTO: JSON.stringify({ SUBSEGMENTO: item.Subsegmento }),
                SUBSEGMENTO2: JSON.stringify({ SUBSEGMENTO2: item.Subsegmento }),
                COR: JSON.stringify({ COR: item.Cor }),
                COR2: JSON.stringify({ COR2: item.Cor }),
                N_TAMANHO: JSON.stringify({ N_TAMANHO: item.Tamanho }),
                N_TAMANHO2: JSON.stringify({ N_TAMANHO2: item.Tamanho }),
                UC: JSON.stringify({ UC: formatDoc }),
                UC2: JSON.stringify({ UC2: formatDoc }),
                PRECO_VDA: JSON.stringify({ PRECO_VDA: item.Preco }),
                PRECO_VDA2: JSON.stringify({ PRECO_VDA2: item.Preco }),
            }
        })
    }

    public async generate(outputFileName: string, data: DiGaspiTagData[]): Promise<Buffer> {
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
                    image,
                    rectangle,
                    line,
                    barcode: barcodes.ean13,
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
