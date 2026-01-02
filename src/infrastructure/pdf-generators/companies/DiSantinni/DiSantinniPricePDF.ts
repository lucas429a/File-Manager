import path from 'path'
import fs from 'fs'
import { generate } from '@pdfme/generator'
import { barcodes, image, multiVariableText, text } from '@pdfme/schemas'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { onlyDigits } from '../../../../shared/utils/formatNumbers'
import { DiSantiniPriceSkuData } from '../../../converters/companies/DiSantini/DiSantiniPriceSkuConverter'
import { DiSantinniPriceFonts } from '../../../../fonts/DiSantinni/DiSantinniPrice.Fonts'
import { DiSantinniPriceTemplate } from '../../templates/companies/DiSantinni/DiSantinniPrice.Template'
import { fakeLogo } from '../../../../logos/logo'

const fontLoader = new DiSantinniPriceFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new DiSantinniPriceTemplate()
const template = TemplateLoader.getTemplate()

export class DiSantinniPricePDF implements IPDFGenerator {
    private prepareInputs(data: DiSantiniPriceSkuData[]): any[] {
        return data.map(item => {
            const skuCode = onlyDigits(item.codigoSku)

            return {
                logo: fakeLogo,
                logo2: fakeLogo,
                UC: JSON.stringify({ UC: item.uc }),
                UC2: JSON.stringify({ UC2: item.uc }),
                CODIGO_DIGITO: JSON.stringify({ CODIGO_DIGITO: item.codigoSku }),
                CODIGO_DIGITO2: JSON.stringify({ CODIGO_DIGITO2: item.codigoSku }),
                DESCRICAO: JSON.stringify({ DESCRICAO: item.descricao.slice(0, 20) }),
                DESCRICAO2: JSON.stringify({ DESCRICAO2: item.descricao.slice(0, 20) }),
                COR: JSON.stringify({ COR: item.cor }),
                COR2: JSON.stringify({ COR2: item.cor }),
                N_TAMANHO: JSON.stringify({ N_TAMANHO: item.tamanho }),
                N_TAMANHO2: JSON.stringify({ N_TAMANHO2: item.tamanho }),
                FAIXA: JSON.stringify({ FAIXA: item.faixa }),
                FAIXA2: JSON.stringify({ FAIXA2: item.faixa }),
                N_PRECO: JSON.stringify({ N_PRECO: item.preco }),
                N_PRECO2: JSON.stringify({ N_PRECO2: item.preco }),
                ITEM: JSON.stringify({ ITEM: item.item }),
                ITEM2: JSON.stringify({ ITEM2: item.item }),
                PRECO: JSON.stringify({ PRECO: item.preco }),
                PRECO2: JSON.stringify({ PRECO2: item.preco }),
                codBarra: skuCode,
                codBarra2: skuCode,
                qrCode: item.codigoSku,
                qrCode2: item.codigoSku,
                TAM: 'TAM:',
                TAM2: 'TAM:',
            }
        })
    }

    public async generate(outputFileName: string, data: DiSantiniPriceSkuData[]): Promise<Buffer> {
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
                    barcode: barcodes.code128,
                    qrCode: barcodes.qrcode,
                    multiVariableText,
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
}
