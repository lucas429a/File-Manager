import fs from 'fs'
import path from 'path'

import { LinsFerraoPriceFonts } from '../../../../fonts/LinsFerrao/LinsFerrao.Fonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { LinsFerraoPriceData } from '../../../converters/companies/LinsFerrao/LinsFerraoPriceConverter'
import { LinsFerraoPriceTemplate } from '../../templates/companies/LinsFerrao/LinsFerraoPrice.Template'
import { generate } from '@pdfme/generator'
import { barcodes, line, multiVariableText, text } from '@pdfme/schemas'

const fontLoader = new LinsFerraoPriceFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new LinsFerraoPriceTemplate()
const template = TemplateLoader.getTemplate()

export class LinsFerraoPricePDF implements IPDFGenerator {
    private prepareInputs(data: LinsFerraoPriceData[]): any[] {
        return data.map(item => {
            return {
                POMPEIA1: 'Pompéia',
                POMPEIA2: 'Pompéia',
                POMPEIA3: 'Pompéia',
                CODBAR1: item.EAN,
                CODBAR2: item.EAN,
                CODBAR3: item.EAN,
                COR1: JSON.stringify({ COR1: item.COR }),
                COR2: JSON.stringify({ COR2: item.COR }),
                COR3: JSON.stringify({ COR3: item.COR }),
                NT1: JSON.stringify({ NT1: item.N_TAMANHO }),
                NT2: JSON.stringify({ NT2: item.N_TAMANHO }),
                NT3: JSON.stringify({ NT3: item.N_TAMANHO }),
                FORNECEDOR1: JSON.stringify({ FORNECEDOR1: item.FORNECEDOR }),
                FORNECEDOR2: JSON.stringify({ FORNECEDOR2: item.FORNECEDOR }),
                FORNECEDOR3: JSON.stringify({ FORNECEDOR3: item.FORNECEDOR }),
                DESCRICAO1: JSON.stringify({ DESCRICAO1: item.DESCRICAO }),
                DESCRICAO2: JSON.stringify({ DESCRICAO2: item.DESCRICAO }),
                DESCRICAO3: JSON.stringify({ DESCRICAO3: item.DESCRICAO }),
                FAIXA1: JSON.stringify({ FAIXA1: item.FAIXA }),
                FAIXA2: JSON.stringify({ FAIXA2: item.FAIXA }),
                FAIXA3: JSON.stringify({ FAIXA3: item.FAIXA }),
                CICLO1: JSON.stringify({ CICLO1: item.CICLOVIDA }),
                CICLO2: JSON.stringify({ CICLO2: item.CICLOVIDA }),
                CICLO3: JSON.stringify({ CICLO3: item.CICLOVIDA }),
                PRECO1: JSON.stringify({ PRECO1: item.PRECO_VDA }),
                PRECO2: JSON.stringify({ PRECO2: item.PRECO_VDA }),
                PRECO3: JSON.stringify({ PRECO3: item.PRECO_VDA }),
                GR1: JSON.stringify({ GR1: item.GRADE }),
                GR2: JSON.stringify({ GR2: item.GRADE }),
                GR3: JSON.stringify({ GR3: item.GRADE }),
                SUBSE1: JSON.stringify({ SUBSE1: item.SUBSEGMENTO }),
                SUBSE2: JSON.stringify({ SUBSE2: item.SUBSEGMENTO }),
                SUBSE3: JSON.stringify({ SUBSE3: item.SUBSEGMENTO }),
            }
        })
    }

    public async generate(outputFileName: string, data: LinsFerraoPriceData[], quantity?: number): Promise<Buffer> {
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
