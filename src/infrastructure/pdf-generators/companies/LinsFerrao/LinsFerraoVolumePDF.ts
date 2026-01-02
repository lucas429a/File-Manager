import fs from 'fs'
import path from 'path'

import { LinsFerraoPriceFonts } from '../../../../fonts/LinsFerrao/LinsFerrao.Fonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { LinsFerraoVolumeData } from '../../../converters/companies/LinsFerrao/LinsFerraoVolume'
import { LinsFerraoVolumeTemplate } from '../../templates/companies/LinsFerrao/LinsFerraoVolume.Template'
import { generate } from '@pdfme/generator'
import { barcodes, multiVariableText } from '@pdfme/schemas'

const fontLoader = new LinsFerraoPriceFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new LinsFerraoVolumeTemplate()
const template = TemplateLoader.getTemplate()

export class LinsFerraoVolumePDF implements IPDFGenerator {
    private prepareInputs(data: LinsFerraoVolumeData[]): any[] {
        return data.map(item => {
            return {
                POMPEIA1: 'Pompéia',
                POMPEIA2: 'Pompéia',
                POMPEIA3: 'Pompéia',
                CODBAR1: item.EAN,
                CODBAR2: item.EAN,
                CODBAR3: item.EAN,
                CODDCO1: JSON.stringify({ CODDCO1: item.COD_DCO }),
                CODDCO2: JSON.stringify({ CODDCO2: item.COD_DCO }),
                CODDCO3: JSON.stringify({ CODDCO3: item.COD_DCO }),
                CICLO1: JSON.stringify({ CICLO1: item.CICLOVIDA }),
                CICLO2: JSON.stringify({ CICLO2: item.CICLOVIDA }),
                CICLO3: JSON.stringify({ CICLO3: item.CICLOVIDA }),
                DEP1: JSON.stringify({ DEP1: item.DEPARTAMENTO }),
                DEP2: JSON.stringify({ DEP2: item.DEPARTAMENTO }),
                DEP3: JSON.stringify({ DEP3: item.DEPARTAMENTO }),
                DESC1: JSON.stringify({ DESC1: item.DESCRICAO }),
                DESC2: JSON.stringify({ DESC2: item.DESCRICAO }),
                DESC3: JSON.stringify({ DESC3: item.DESCRICAO }),
                COR1: JSON.stringify({ COR1: item.COR }),
                COR2: JSON.stringify({ COR2: item.COR }),
                COR3: JSON.stringify({ COR3: item.COR }),
                FAIXA1: JSON.stringify({ FAIXA1: item.FAIXA }),
                FAIXA2: JSON.stringify({ FAIXA2: item.FAIXA }),
                FAIXA3: JSON.stringify({ FAIXA3: item.FAIXA }),
                SUBSEG1: JSON.stringify({ SUBSEG1: item.SUBSEGMENTO }),
                SUBSEG2: JSON.stringify({ SUBSEG2: item.SUBSEGMENTO }),
                SUBSEG3: JSON.stringify({ SUBSEG3: item.SUBSEGMENTO }),
                GQ1: JSON.stringify({ GQ1: item.GRADE_QTD }),
                GQ2: JSON.stringify({ GQ2: item.GRADE_QTD }),
                GQ3: JSON.stringify({ GQ3: item.GRADE_QTD }),
            }
        })
    }

    public async generate(outputFileName: string, data: LinsFerraoVolumeData[], quantity?: number): Promise<Buffer> {
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
                    multiVariableText,
                    barcode: barcodes.code128,
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
