import path from 'path'
import fs from 'fs'
import { BesniPriceFonts } from '../../../../fonts/Besni/BesniPriceFonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { BesniPriceData } from '../../../converters/companies/Besni/BesniPriceConverter'
import { BesniPriceTemplate } from '../../templates/companies/Besni/BesniPriceTemplate'
import { generate } from '@pdfme/generator'
import { barcodes, line, multiVariableText, rectangle, text, image, svg } from '@pdfme/schemas'
import { fakeLogo } from '../../../../logos/logo'
import { ponintForComa } from '../../../../shared/utils/formatStrings'

const fontLoader = new BesniPriceFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new BesniPriceTemplate()
const template = TemplateLoader.getTemplate()

export class BesniPricePDF implements IPDFGenerator {
    private prepareInputs(data: BesniPriceData[]): any[] {
        return data.map(item => {
            const cleanEan = item.ean13 ? item.ean13.trim().replace(/\s+/g, '') : ''

            return {
                TAM1: 'TAM',
                TAM2: 'TAM',
                HT1: 'TROCA MANTER ESSA ETIQUETA',
                HT2: 'TRAZER CUPOM FISCAL, RG E CPF',
                HT3: 'NÃO TROCAMOS PEÇAS INTIMAS',
                HT4: 'TROCA MANTER ESSA ETIQUETA',
                HT5: 'TRAZER CUPOM FISCAL, RG E CPF',
                HT6: 'NÃO TROCAMOS PEÇAS INTIMAS',
                R$1: 'R$',
                R$2: 'R$',
                BesniLogo1: fakeLogo,
                BesniLogo2: fakeLogo,
                DESCRICAO1: JSON.stringify({ DESCRICAO1: item.matforn }),
                DESCRICAO2: JSON.stringify({ DESCRICAO2: item.matforn }),
                SUBSEGMENTO1: JSON.stringify({ SUBSEGMENTO1: item.corforn }),
                SUBSEGMENTO2: JSON.stringify({ SUBSEGMENTO2: item.corforn }),
                COR1: JSON.stringify({ COR1: item.cor }),
                COR2: JSON.stringify({ COR2: item.cor }),
                N_TAMANHO1: JSON.stringify({ N_TAMANHO1: item.tamanho }),
                N_TAMANHO2: JSON.stringify({ N_TAMANHO2: item.tamanho }),
                DEPARTAMENTO1: JSON.stringify({ DEPARTAMENTO1: item.gmerc }),
                DEPARTAMENTO2: JSON.stringify({ DEPARTAMENTO2: item.gmerc }),
                CODIGO_DIGITO1: JSON.stringify({ CODIGO_DIGITO1: item.codigo }),
                CODIGO_DIGITO2: JSON.stringify({ CODIGO_DIGITO2: item.codigo }),
                PRECO_VDA1: JSON.stringify({ PRECO_VDA1: ponintForComa(item.valor) }),
                PRECO_VDA2: JSON.stringify({ PRECO_VDA2: ponintForComa(item.valor) }),
                CODIGO_MATERIAL_SKU1: JSON.stringify({ CODIGO_MATERIAL_SKU1: item.codigock }),
                CODIGO_MATERIAL_SKU2: JSON.stringify({ CODIGO_MATERIAL_SKU2: item.codigock }),
                BarEAN1: cleanEan,
                BarEAN2: cleanEan,
            }
        })
    }

    public async generate(outputFileName: string, data: BesniPriceData[], quantity?: number): Promise<Buffer> {
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
                    multiVariableText,
                    barcode: barcodes.ean13,
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
