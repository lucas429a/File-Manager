import fs from 'fs'
import path from 'path'

import { TorraTagFonts } from '../../../../fonts/Torra/TorraTag.Fonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { TorraTagData } from '../../../converters/companies/Torra/TorraTagConverter'
import { TorraTagTemplate } from '../../templates/companies/Torra/TorraTag.Template'
import { generate } from '@pdfme/generator'
import { barcodes, image, multiVariableText, rectangle, text } from '@pdfme/schemas'
import { fakeLogo } from '../../../../logos/logo'

const fontLoader = new TorraTagFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new TorraTagTemplate()
const template = TemplateLoader.getTemplate()

export class TorraTagPDF implements IPDFGenerator {
    private prepareInputs(data: TorraTagData[]): any[] {
        return data.map(item => ({
            TAMANHO: 'TAMANHO',
            TAMANHO2: 'TAMANHO',
            R$: 'R$',
            R$2: 'R$',
            N_TAMANHO: JSON.stringify({ N_TAMANHO: item.N_TAMANHO }),
            N_TAMANHO2: JSON.stringify({ N_TAMANHO2: item.N_TAMANHO }),
            SUBSEGMENTO: JSON.stringify({ SUBSEGMENTO: item.SUBSEGMENTO }),
            SUBSEGMENTO2: JSON.stringify({ SUBSEGMENTO2: item.SUBSEGMENTO }),
            SEMANA: JSON.stringify({ SEMANA: item.SEMANA }),
            SEMANA2: JSON.stringify({ SEMANA2: item.SEMANA }),
            NOME_EMPRESA: JSON.stringify({ NOME_EMPRESA: item.NOME_EMPRESA }),
            NOME_EMPRESA2: JSON.stringify({ NOME_EMPRESA2: item.NOME_EMPRESA }),
            DEPARTAMENTO: JSON.stringify({ DEPARTAMENTO: item.DEPARTAMENTO.slice(0, 10) }),
            DEPARTAMENTO2: JSON.stringify({ DEPARTAMENTO2: item.DEPARTAMENTO.slice(0, 10) }),
            COD_DCO: JSON.stringify({ COD_DCO: item.COD_DCO }),
            COD_DCO2: JSON.stringify({ COD_DCO2: item.COD_DCO }),
            DESCRICAO: JSON.stringify({ DESCRICAO: item.DESCRICAO }),
            DESCRICAO2: JSON.stringify({ DESCRICAO2: item.DESCRICAO }),
            COR: JSON.stringify({ COR: item.COR }),
            COR2: JSON.stringify({ COR2: item.COR }),
            PRECO_VDA: JSON.stringify({ PRECO_VDA: item.PRECO_VDA }),
            PRECO_VDA2: JSON.stringify({ PRECO_VDA2: item.PRECO_VDA }),
            FORNECEDOR: JSON.stringify({ FORNECEDOR: item.FORNECEDOR }),
            FORNECEDOR2: JSON.stringify({ FORNECEDOR2: item.FORNECEDOR }),
            QR: `https://www.lojastorra.com.br/s?q=${item.COD_DCO}&utn_source=loja&utm_campaingn=etiqueta`,
            QR2: `https://www.lojastorra.com.br/s?q=${item.COD_DCO}&utn_source=loja&utm_campaingn=etiqueta`,
            CODBARRA: item.COD_BARRA,
            CODBARRA2: item.COD_BARRA,
            LOGO: fakeLogo,
            LOGO2: fakeLogo,
        }))
    }

    public async generate(outputFileName: string, data: TorraTagData[], quantity?: number): Promise<Buffer> {
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
                    barCode: barcodes.ean13,
                    image,
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
