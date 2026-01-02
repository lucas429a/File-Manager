import fs from 'fs'
import path from 'path'
import { AvenidaPriceFonts } from '../../../../fonts/Avenida/AvenidaPrice.Fonts'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { AvenidaTagData } from '../../../converters/companies/Avenida/AvenidaTagConverter'
import { AvenidaPriceTemplate } from '../../templates/companies/Avenida/AvenidaPrice.Template'
import { AvenidaPriceHeaderTemplate } from '../../templates/companies/Avenida/AvenidaPriceHeader.Template'
import { PDFDocument } from 'pdf-lib'
import { generate } from '@pdfme/generator'
import { barcodes, image, multiVariableText, rectangle, text } from '@pdfme/schemas'
import { fakeLogo } from '../../../../logos/logo'
const fontLoader = new AvenidaPriceFonts()
const font = fontLoader.getAllFonts()

const priceTemplateLoader = new AvenidaPriceTemplate()
const priceTemplate = priceTemplateLoader.getTemplate()

const headerTemplateLoader = new AvenidaPriceHeaderTemplate()
const headerTemplate = headerTemplateLoader.getTemplate()

export class AvenidaPricePDF implements IPDFGenerator {
    private format(value: number): string {
        return value.toString().padStart(4, '0')
    }

    private preparePriceInputs(data: AvenidaTagData[]): any[] {
        let globalIndex = 0
        return data.map(item => {
            const logo = item.COD_DCO === '31' ? fakeLogo : fakeLogo

            return {
                HT1: 'Apresentar cupom fiscal em caso de troca',
                HT2: 'Apresentar cupom fiscal em caso de troca',
                LOGO: logo,
                LOGO2: logo,
                UC: JSON.stringify({ UC: item.UC }),
                UC2: JSON.stringify({ UC2: item.UC }),
                DESCRICAO: JSON.stringify({ DESCRICAO: item.DESCRICAO }),
                DESCRICAO2: JSON.stringify({ DESCRICAO2: item.DESCRICAO }),
                'TAM:': 'TAM:',
                'TAM2:': 'TAM:',
                'COR:': 'COR:',
                'COR2:': 'COR:',
                COR: JSON.stringify({ COR: item.COR }),
                COR2: JSON.stringify({ COR2: item.COR }),
                'R$:': 'R$',
                R$2: 'R$',
                N_TAMANHO: JSON.stringify({ N_TAMANHO: item.N_TAMANHO }),
                N_TAMANHO2: JSON.stringify({ N_TAMANHO2: item.N_TAMANHO }),
                BARCODE: item.COD_BARRA,
                BARCODE2: item.COD_BARRA,
                PRECO_VDA: JSON.stringify({ PRECO_VDA: item.PRECO_VDA }),
                PRECO_VDA2: JSON.stringify({ PRECO_VDA2: item.PRECO_VDA }),
                COD_DCO: JSON.stringify({ COD_DCO: item.COD_DCO }),
                COD_DCO2: JSON.stringify({ COD_DCO2: item.COD_DCO }),
                CENTRO_FATURAMENTO: JSON.stringify({ CENTRO_FATURAMENTO: item.CENTRO_FATURAMENTO }),
                CENTRO_FATURAMENTO2: JSON.stringify({ CENTRO_FATURAMENTO2: item.CENTRO_FATURAMENTO }),
                DES_ENDERECO: JSON.stringify({ DES_ENDERECO: item.DES_ENDERECO }),
                DES_ENDERECO2: JSON.stringify({ DES_ENDERECO2: item.DES_ENDERECO }),
                ITEM: JSON.stringify({ ITEM: item.ITEM }),
                ITEM2: JSON.stringify({ ITEM2: item.ITEM }),
                N_PEDIDO: JSON.stringify({ N_PEDIDO: item.N_PEDIDO }),
                N_PEDIDO2: JSON.stringify({ N_PEDIDO2: item.N_PEDIDO }),
            }
        })
    }

    private prepareHeaderInputs(item: AvenidaTagData) {
        return [
            {
                UC: JSON.stringify({ UC: item.UC }),
                UC2: JSON.stringify({ UC2: item.UC }),
                DESCRICAO: JSON.stringify({ DESCRICAO: item.DESCRICAO }),
                DESCRICAO2: JSON.stringify({ DESCRICAO2: item.DESCRICAO }),
                COR: JSON.stringify({ COR: item.COR }),
                COR2: JSON.stringify({ COR2: item.COR }),
                'COR:': 'COR:',
                'COR2:': 'COR:',
                'TAM:': 'TAM:',
                'TAM2:': 'TAM:',
                N_TAMANHO: JSON.stringify({ N_TAMANHO: item.N_TAMANHO }),
                N_TAMANHO2: JSON.stringify({ N_TAMANHO2: item.N_TAMANHO }),
            },
        ]
    }

    private groupByTamanho(data: AvenidaTagData[]) {
        return data.reduce((groups, item) => {
            const key = item.N_TAMANHO || ''
            if (!groups[key]) {
                groups[key] = []
            }
            groups[key].push(item)
            return groups
        }, {} as Record<string, AvenidaTagData[]>)
    }

    public async generate(outputFileName: string, data: AvenidaTagData[], quantity?: number): Promise<Buffer> {
        const uploadsDir = path.resolve(__dirname, '../../../../uploads')
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true })
        }

        const filePath = path.join(uploadsDir, outputFileName)

        try {
            const groupedData = this.groupByTamanho(data)

            const mergedPdfDoc = await PDFDocument.create()

            for (const [tamanho, items] of Object.entries(groupedData)) {
                if (items.length === 0) continue

                const headerInputs = this.prepareHeaderInputs(items[0])
                const headerPdf = await generate({
                    template: headerTemplate,
                    inputs: headerInputs,
                    plugins: {
                        multiVariableText,
                        text,
                    },
                    options: {
                        font: font as any,
                    },
                })

                const priceInputs = this.preparePriceInputs(items)

                const pricePdf = await generate({
                    template: priceTemplate,
                    inputs: priceInputs,
                    plugins: {
                        multiVariableText,
                        text,
                        rectangle,
                        image,
                        barcodes: barcodes.code128,
                    },
                    options: {
                        font: font as any,
                    },
                })

                const headerPdfDoc = await PDFDocument.load(headerPdf)
                const pricePdfDoc = await PDFDocument.load(pricePdf)

                const headerPages = await mergedPdfDoc.copyPages(headerPdfDoc, headerPdfDoc.getPageIndices())
                headerPages.forEach(page => mergedPdfDoc.addPage(page))

                const pricePages = await mergedPdfDoc.copyPages(pricePdfDoc, pricePdfDoc.getPageIndices())
                pricePages.forEach(page => mergedPdfDoc.addPage(page))
            }

            const mergedPdfBytes = await mergedPdfDoc.save()

            fs.writeFileSync(filePath, mergedPdfBytes)
            return Buffer.from(mergedPdfBytes)
        } catch (error: any) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                data: data,
            })
            throw error
        }
    }
}
