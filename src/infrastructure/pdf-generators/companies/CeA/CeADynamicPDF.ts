import fs from 'fs'
import path from 'path'

import { CeAFonts } from '../../../../fonts/CeA/CeA.Fonts'
import { IDynamicPDFGenerator } from '../../../factories/DynamicPDFGeneratorFactory'
import { CeADynamicInsoleTemplate } from '../../templates/companies/CeA/CeADynamicInsole.Template'
import { generate } from '@pdfme/generator'
import { multiVariableText, text } from '@pdfme/schemas'

const fontLoader = new CeAFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new CeADynamicInsoleTemplate()
const template = TemplateLoader.getTemplate()

export class CeADynamicPDFGenerator implements IDynamicPDFGenerator {
    private prepareInputs(data: Record<string, any>[], quantity?: number): any[] {
        return data.map(item => ({
            FAB1: 'FABRICADO NO BRASIL',
            FAB2: 'FABRICADO NO BRASIL',
            FAB3: 'FABRICADO NO BRASIL',
            MODELO1: JSON.stringify({ MODELO1: item.MOD }),
            MODELO2: JSON.stringify({ MODELO2: item.MOD }),
            MODELO3: JSON.stringify({ MODELO3: item.MOD }),
            CNPJ1: JSON.stringify({ CNPJ1: `CNPJ: ${item.CNPJ}` }),
            CNPJ2: JSON.stringify({ CNPJ2: `CNPJ: ${item.CNPJ}` }),
            CNPJ3: JSON.stringify({ CNPJ3: `CNPJ: ${item.CNPJ}` }),
            CAB1: JSON.stringify({ CAB1: `CABEDAL:${item.CAB}` }),
            CAB2: JSON.stringify({ CAB2: `CABEDAL:${item.CAB}` }),
            CAB3: JSON.stringify({ CAB3: `CABEDAL:${item.CAB}` }),
            FORRO1: JSON.stringify({ FORRO1: 'FORRO E PALMILHA: TÊXTIL' }),
            FORRO2: JSON.stringify({ FORRO2: 'FORRO E PALMILHA: TÊXTIL' }),
            FORRO3: JSON.stringify({ FORRO3: 'FORRO E PALMILHA: TÊXTIL' }),
            SOLA1: JSON.stringify({ SOLA1: 'SOLA: OUTROS MATERIAIS' }),
            SOLA2: JSON.stringify({ SOLA2: 'SOLA: OUTROS MATERIAIS' }),
            SOLA3: JSON.stringify({ SOLA3: 'SOLA: OUTROS MATERIAIS' }),
            COD1: JSON.stringify({ COD1: `Modelo: ${item.COD}` }),
            COD2: JSON.stringify({ COD2: `Modelo: ${item.COD}` }),
            COD3: JSON.stringify({ COD3: `Modelo: ${item.COD}` }),
            FORN1: JSON.stringify({ FORN1: 'Fornecedor : 85028' }),
            FORN2: JSON.stringify({ FORN2: 'Fornecedor : 85028' }),
            FORN3: JSON.stringify({ FORN3: 'Fornecedor : 85028' }),
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
            console.error('Error to generate dynamic PDF', error)
            throw new Error('Failed to generate dynamic PDF: ' + (error as Error).message)
        }
    }
}
