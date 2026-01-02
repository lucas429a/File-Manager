import fs from 'fs'
import path from 'path'

import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { CeAPriceData } from '../../../converters/companies/CeA/CeAPriceConverter'
import { generate } from '@pdfme/generator'
import { CeAFonts } from '../../../../fonts/CeA/CeA.Fonts'
import { CeAPriceTemplate } from '../../templates/companies/CeA/CeAPrice.Template'
import { barcodes, image, multiVariableText, rectangle, text } from '@pdfme/schemas'
import { fakeLogo } from '../../../../logos/logo'

const fontLoader = new CeAFonts()
const font = fontLoader.getAllFonts()

const TemplateLoader = new CeAPriceTemplate()
const template = TemplateLoader.getTemplate()

export class CeAPricePDF implements IPDFGenerator {
    private prepareInputs(data: CeAPriceData[]): any[] {
        return data.map(item => {
            const formattedFX = item.FAIXA.slice(0, 40) + ' ' + item.FAIXA.slice(40)
            const formattedDescription = item.DESCRICAO.slice(0, 20) + ' ' + item.DESCRICAO.slice(20)

            return {
                LOGO1: fakeLogo,
                LOGO2: fakeLogo,
                SCISSORS1: fakeLogo,
                SCISSORS2: fakeLogo,
                // LOGO2: 'Manter Etiqueta em Caso de Troca',
                R$: 'R$',
                R$2: 'R$',
                TamanhoHP: 'Tamanho',
                TamanhoHP2: 'Tamanho',
                CM1: JSON.stringify({ CM1: item.CODIGO_MASTER }),
                CM2: JSON.stringify({ CM2: item.CODIGO_MASTER }),
                CD1: JSON.stringify({ CD1: item.CODIGO_DIGITO }),
                CD2: JSON.stringify({ CD2: item.CODIGO_DIGITO }),
                UC1: JSON.stringify({ UC1: item.UC }),
                UC2: JSON.stringify({ UC2: item.UC }),
                GR1: JSON.stringify({ GR1: item.GRADE }),
                GR2: JSON.stringify({ GR2: item.GRADE }),
                GRQ1: JSON.stringify({ GRQ1: item.GRADE_QTD }),
                GRQ2: JSON.stringify({ GRQ2: item.GRADE_QTD }),
                SEM1: JSON.stringify({ SEM1: item.SEMANA }),
                SEM2: JSON.stringify({ SEM2: item.SEMANA }),
                SUB1: JSON.stringify({ SUB1: item.SUBSEGMENTO }),
                SUB2: JSON.stringify({ SUB2: item.SUBSEGMENTO }),
                VOL1: JSON.stringify({ VOL1: item.VOLUME }),
                VOL2: JSON.stringify({ VOL2: item.VOLUME }),
                FX1: JSON.stringify({ FX1: formattedFX }),
                FX2: JSON.stringify({ FX2: formattedFX }),
                NT1: JSON.stringify({ NT1: `TAM:                                             ${item.N_TAMANHO}` }),
                NT2: JSON.stringify({ NT2: `TAM:                                             ${item.N_TAMANHO}` }),
                NP1: JSON.stringify({ NP1: item.N_PEDIDO }),
                NP2: JSON.stringify({ NP2: item.N_PEDIDO }),
                EAN1: JSON.stringify({ EAN1: item.EAN }),
                EAN2: JSON.stringify({ EAN2: item.EAN }),
                TT1: JSON.stringify({ TT1: item.TOTAL }),
                TT2: JSON.stringify({ TT2: item.TOTAL }),
                ANO1: JSON.stringify({ ANO1: item.ANO }),
                ANO2: JSON.stringify({ ANO2: item.ANO }),
                VP1: JSON.stringify({ VP1: '1' }),
                VP2: JSON.stringify({ VP2: '2' }),
                DA1: JSON.stringify({ DA1: item.DES_AUXILIAR_1 }),
                DA2: JSON.stringify({ DA2: item.DES_AUXILIAR_2 }),
                IT1: JSON.stringify({ IT1: item.ITEM }),
                IT2: JSON.stringify({ IT2: item.ITEM }),
                DESC1: JSON.stringify({ DESC1: formattedDescription }),
                DESC2: JSON.stringify({ DESC2: formattedDescription }),
                CODBAR1: `${item.N_PEDIDO}${item.EAN}${item.ANO}1${item.DES_AUXILIAR_1}`,
                //CODBAR1: '12345678901234',
                CODBAR2: `${item.N_PEDIDO}${item.EAN}${item.ANO}2${item.DES_AUXILIAR_2}`,
                // CODBAR2: '12345678901234',
                PVD: JSON.stringify({ PVD: `R$         ${item.PRECO_VDA.slice(0, 4)}` }),
                CENTS: JSON.stringify({ CENTS: item.PRECO_VDA.slice(-2) }),
                PD: JSON.stringify({ PD: item.SUBSEGMENTO.slice(0, 1) }),
            }
        })
    }

    public async generate(outputFileName: string, data: CeAPriceData[]): Promise<Buffer> {
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
                    ...barcodes,
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
