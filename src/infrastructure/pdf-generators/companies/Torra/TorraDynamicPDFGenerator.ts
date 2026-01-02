import path from 'path'
import fs from 'fs'
import { TorraTagFonts } from '../../../../fonts/Torra/TorraTag.Fonts'
import { IDynamicPDFGenerator } from '../../../factories/DynamicPDFGeneratorFactory'
import { TorraDynamicInsoleTemplate } from '../../templates/companies/Torra/TorraDynamicInsole.Template'
import { generate } from '@pdfme/generator'
import { image, multiVariableText, text } from '@pdfme/schemas'
import { fakeLogo } from '../../../../logos/logo'

const fontLoader = new TorraTagFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new TorraDynamicInsoleTemplate()
const template = TemplateLoader.getTemplate()

export class TorraDynamicPDFGenerator implements IDynamicPDFGenerator {
    private prepareInputs(data: Record<string, any>[], quantity?: number): any[] {
        return data.map(item => ({
            // CNPJ1: 'CNPJ:',
            // CNPJ2: 'CNPJ:',
            // CNPJ3: 'CNPJ:',
            CNPJN1: JSON.stringify({ CNPJN1: `CNPJ :${item.CNPJN}` }),
            CNPJN2: JSON.stringify({ CNPJN2: `CNPJ :${item.CNPJN}` }),
            CNPJN3: JSON.stringify({ CNPJN3: `CNPJ :${item.CNPJN}` }),
            NOME1: JSON.stringify({ NOME1: `${item['NOME_EMPRESA']} IND. CALÇADOS` }),
            NOME2: JSON.stringify({ NOME2: `${item['NOME_EMPRESA']} IND. CALÇADOS` }),
            NOME3: JSON.stringify({ NOME3: `${item['NOME_EMPRESA']} IND. CALÇADOS` }),
            IBR1: 'INDÚSTRIA BRASILEIRA',
            IBR2: 'INDÚSTRIA BRASILEIRA',
            IBR3: 'INDÚSTRIA BRASILEIRA',
            CODIGO1: JSON.stringify({ CODIGO1: `CD-ITEM: ${item.CODIGO}` }),
            CODIGO2: JSON.stringify({ CODIGO2: `CD-ITEM: ${item.CODIGO}` }),
            CODIGO3: JSON.stringify({ CODIGO3: `CD-ITEM: ${item.CODIGO}` }),
            MODELO_COR1: JSON.stringify({ MODELO_COR1: item['MODELO_COR'] }),
            MODELO_COR2: JSON.stringify({ MODELO_COR2: item['MODELO_COR'] }),
            MODELO_COR3: JSON.stringify({ MODELO_COR3: item['MODELO_COR'] }),
            image1: fakeLogo,
            image2: fakeLogo,
            image3: fakeLogo,
        }))
    }

    async generate(outputFileName: string, templateType: string, data: Record<string, any>[], quantity: number = 1): Promise<Buffer> {
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
                    text,
                    multiVariableText,
                    image,
                },
                options: { font: font as any },
            })

            fs.writeFileSync(filePath, pdf)
            return Buffer.from(pdf)
        } catch (error) {
            console.error('Error to generate dynamic PDF Torra', error)
            throw new Error('Failed to generate dynamic PDF Torra: ' + (error as Error).message)
        }
    }
}
