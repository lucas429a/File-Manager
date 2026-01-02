import path from 'path'
import fs from 'fs'

import { CaeduFonts } from '../../../../fonts/Caedu/Caedu.Fonts'
import { IDynamicPDFGenerator } from '../../../factories/DynamicPDFGeneratorFactory'
import { CaeduDynamicTagTemplate } from '../../templates/companies/Caedu/CaeduDynamicInsole.Template'
import { fakeLogo } from '../../../../logos/logo'
import { generate } from '@pdfme/generator'
import { image, multiVariableText, text } from '@pdfme/schemas'

const fontLoader = new CaeduFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new CaeduDynamicTagTemplate()
const template = TemplateLoader.getTemplate()

export class CaeduDynamicPDFGenerator implements IDynamicPDFGenerator {
    private prepareInputs(data: Record<string, any>[], quantity?: number): any[] {
        return data.map(item => ({
            CNPJN1: JSON.stringify({ CNPJN1: `CNPJ :${item.CNPJN}` }),
            CNPJN2: JSON.stringify({ CNPJN2: `CNPJ :${item.CNPJN}` }),
            CNPJN3: JSON.stringify({ CNPJN3: `CNPJ :${item.CNPJN}` }),
            NOME1: JSON.stringify({ NOME1: `${item['NOME_EMPRESA']} IND. CALÇADOS LTDA` }),
            NOME2: JSON.stringify({ NOME2: `${item['NOME_EMPRESA']} IND. CALÇADOS LTDA` }),
            NOME3: JSON.stringify({ NOME3: `${item['NOME_EMPRESA']} IND. CALÇADOS LTDA` }),
            IBR1: 'INDÚSTRIA BRASILEIRA',
            IBR2: 'INDÚSTRIA BRASILEIRA',
            IBR3: 'INDÚSTRIA BRASILEIRA',
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
            console.error('Error to generate Caedu', error)
            throw new Error('Falha ao gerar PDF dinâmico caedu: ' + (error as Error).message)
        }
    }
}
