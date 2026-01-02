import path from 'path'
import fs from 'fs'

import { PernambucanasTagFonts } from '../../../../fonts/Pernambucanas/PernambucanasTag.Fonts'
import { IDynamicPDFGenerator } from '../../../factories/DynamicPDFGeneratorFactory'
import { PernambucanasDynamicInsoleTemplate } from '../../templates/companies/Pernambucanas/PernambucanasDynamicInsole.Template'
import { generate } from '@pdfme/generator'
import { multiVariableText, text } from '@pdfme/schemas'

const fontLoader = new PernambucanasTagFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new PernambucanasDynamicInsoleTemplate()
const template = TemplateLoader.getTemplate()

export class PernambucanasDynamicPDFGenerator implements IDynamicPDFGenerator {
    private prepareInputs(data: Record<string, any>[], quantity?: number): any[] {
        return data.map(item => ({
            CNPJ1: 'CNPJ:',
            CNPJ2: 'CNPJ:',
            CNPJ3: 'CNPJ:',
            CNPJN1: JSON.stringify({ CNPJN1: item.CNPJN }),
            CNPJN2: JSON.stringify({ CNPJN2: item.CNPJN }),
            CNPJN3: JSON.stringify({ CNPJN3: item.CNPJN }),
            NOME1: JSON.stringify({ NOME1: `${item['NOME_EMPRESA']} IND. CALÇADOS LTDA` }),
            NOME2: JSON.stringify({ NOME2: `${item['NOME_EMPRESA']} IND. CALÇADOS LTDA` }),
            NOME3: JSON.stringify({ NOME3: `${item['NOME_EMPRESA']} IND. CALÇADOS LTDA` }),
            // IND1: 'IND. CALÇADOS LTDA',
            // IND2: 'IND. CALÇADOS LTDA',
            // IND3: 'IND. CALÇADOS LTDA',
            IBR1: 'INDÚSTRIA BRASILEIRA',
            IBR2: 'INDÚSTRIA BRASILEIRA',
            IBR3: 'INDÚSTRIA BRASILEIRA',
            ART1: 'ARTIGO:',
            ART2: 'ARTIGO:',
            ART3: 'ARTIGO:',
            ARTIGO1: JSON.stringify({ ARTIGO1: item.ARTICLE }),
            ARTIGO2: JSON.stringify({ ARTIGO2: item.ARTICLE }),
            ARTIGO3: JSON.stringify({ ARTIGO3: item.ARTICLE }),
            MODELO_COR1: JSON.stringify({ MODELO_COR1: item['MODELO_COR'] }),
            MODELO_COR2: JSON.stringify({ MODELO_COR2: item['MODELO_COR'] }),
            MODELO_COR3: JSON.stringify({ MODELO_COR3: item['MODELO_COR'] }),
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
                },
                options: { font: font as any },
            })

            fs.writeFileSync(filePath, pdf)
            return Buffer.from(pdf)
        } catch (error) {
            console.error('Error to generate dynamic PDF to Torra', error)
            throw new Error('Failed to generate dynamic PDF to Torra: ' + (error as Error).message)
        }
    }
}
