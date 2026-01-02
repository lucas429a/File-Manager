import path from 'path'
import fs from 'fs'
import { generate } from '@pdfme/generator'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { RiachueloTagPriceData } from '../../../converters/companies/Riachuelo/RiachueloPriceTagConverter'
import { barcodes, multiVariableText, rectangle, text } from '@pdfme/schemas'
import { RiachueloPriceTemaplate } from '../../templates/companies/Riachuelo/RiachueloPrice.Template'
import { RiachueloPriceFonts } from '../../../../fonts/riachuelo/RiachueloPrice.Fonts'
import { RiachueloPriceHeaderTemplate } from '../../templates/companies/Riachuelo/RiachueloPriceHeader.Template'
import { PDFDocument } from 'pdf-lib'

const fontLoader = new RiachueloPriceFonts()
const font = fontLoader.getAllFonts()

const priceTemplateLoader = new RiachueloPriceTemaplate()
const priceTemplate = priceTemplateLoader.getTemplate()

const headerTemplateLoader = new RiachueloPriceHeaderTemplate()
const headerTemplate = headerTemplateLoader.getTemplate()

export class RiachueloPricePDF implements IPDFGenerator {
    private format(value: number): string {
        return value.toString().padStart(4, '0')
    }

    private preparePriceInputs(data: RiachueloTagPriceData[]): any[] {
        let globalIndex = 0
        return data.map(item => {
            const currentIndex = ++globalIndex
            const barcode2 = `4${parseInt(item.Grade, 10)}${item.Digito}${this.format(currentIndex - 1)}`
            const barcode1 = `3${parseInt(item.Grade, 10)}${item.Digito}${this.format(currentIndex - 1)}`
            return {
                TAMANHO: 'TAMANHO',
                TAMANHO2: 'TAMANHO',
                R$: 'R$',
                UC: JSON.stringify({ UC: item.CodigoBureau }),
                UC2: JSON.stringify({ UC2: item.CodigoBureau }),
                CODIGO_MASTER: JSON.stringify({ CODIGO_MASTER: item.MaterialForn }),
                CODIGO_MASTER2: JSON.stringify({ CODIGO_MASTER2: item.MaterialForn }),
                GRADE: JSON.stringify({ GRADE: parseInt(item.Grade, 10) }),
                GRADE2: JSON.stringify({ GRADE2: parseInt(item.Grade, 10) }),
                GRADE3: JSON.stringify({ GRADE3: parseInt(item.Grade, 10) }),
                GRADE4: JSON.stringify({ GRADE4: parseInt(item.Grade, 10) }),
                CODIGO_DIGITO: JSON.stringify({ CODIGO_DIGITO: item.Digito }),
                CODIGO_DIGITO2: JSON.stringify({ CODIGO_DIGITO2: item.Digito }),
                DEPARTAMENTO: JSON.stringify({ DEPARTAMENTO: item.CodDepto }),
                DEPARTAMENTO2: JSON.stringify({ DEPARTAMENTO2: item.CodDepto }),
                SEMANA: JSON.stringify({ SEMANA: item.DataEntrega }),
                SEMANA2: JSON.stringify({ SEMANA2: item.DataEntrega }),
                SUBSEGMENTO: JSON.stringify({ SUBSEGMENTO: item.EstrColecao }),
                SUBSEGMENTO2: JSON.stringify({ SUBSEGMENTO2: item.EstrColecao }),
                CICLOVIDA: JSON.stringify({ CICLOVIDA: item.Estacao }),
                CICLOVIDA2: JSON.stringify({ CICLOVIDA2: item.Estacao }),
                COR: JSON.stringify({ COR: this.getFirstColorWord(item.Cor) }),
                COR2: JSON.stringify({ COR2: this.getFirstColorWord(item.Cor) }),
                DESCRICAO: JSON.stringify({ DESCRICAO: item.DescricaoMaterial }),
                DESCRICAO2: JSON.stringify({ DESCRICAO2: item.DescricaoMaterial }),
                N_TAMANHO: JSON.stringify({ N_TAMANHO: item.Tamanho }),
                N_TAMANHO2: JSON.stringify({ N_TAMANHO2: item.Tamanho }),
                PRECO_VDA: JSON.stringify({ PRECO_VDA: item.PrecoMaterial }),
                CodBarra1: barcode1,
                CodBarra2: barcode2,
                qrCode1: `https://www.riachuelo.com.br/qrcode/?tipo=Tenis&cor=${item.Cor}&genero=&sku=${parseInt(item.Grade, 10)}&dco=${item.CodDepto}`,
                qrCode2: `https://www.riachuelo.com.br/qrcode/?tipo=Tenis&cor=${item.Cor}&genero=&sku=${parseInt(item.Grade, 10)}&dco=${item.CodDepto}`,
            }
        })
    }

    private prepareHeaderInputs(item: RiachueloTagPriceData) {
        return [
            {
                FORNECEDOR: 'FORNECEDOR : META INDUSTRIA D',
                MATERIAL: 'MATERIAL :',
                REF: 'REF FORN :',
                PEDIDO: 'PEDIDO :',
                GRADE: JSON.stringify({ GRADE: parseInt(item.Grade, 10) }),
                N_PEDIDO: JSON.stringify({ N_PEDIDO: item.PedidoCodigo }),
                ITEMPED: 'ITEM PED :',
            },
        ]
    }

    private groupByTamanho(data: RiachueloTagPriceData[]) {
        return data.reduce((groups, item) => {
            const key = item.Tamanho || ''
            if (!groups[key]) {
                groups[key] = []
            }
            groups[key].push(item)
            return groups
        }, {} as Record<string, RiachueloTagPriceData[]>)
    }

    public async generate(outputFileName: string, data: RiachueloTagPriceData[], quantity?: number): Promise<Buffer> {
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
                        qrCode: barcodes.qrcode,
                        barCode: barcodes.code128,
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
        } catch (error) {
            console.error('Error to generate PDF:', error)
            throw new Error('Failed to generate PDF: ' + (error as Error).message)
        }
    }

    private getFirstColorWord(cor: string): string {
        if (!cor) return ''
        return cor.split(' ')[0]
    }
}
