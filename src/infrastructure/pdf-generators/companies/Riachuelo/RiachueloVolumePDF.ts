import path from 'path'
import fs from 'fs'
import { IPDFGenerator } from '../../../factories/PDFGeneratorFactory'
import { RiachueloVolumeFonts } from '../../../../fonts/riachuelo/RiachueloVolume.Fonts'
import { RiachueloVolumeTagData } from '../../../converters/companies/Riachuelo/RiachueloVolumeTagConverter'
import { generate } from '@pdfme/generator'
import { barcodes, multiVariableText, text } from '@pdfme/schemas'
import { RiachueloVolumeTemplate } from '../../templates/companies/Riachuelo/RiachueloVolume.Template'
import { RiachueloVolumeHeader } from '../../templates/companies/Riachuelo/RiachueloVolumeHeader.Template'
import { PDFDocument } from 'pdf-lib'

const fontLoader = new RiachueloVolumeFonts()
const font = fontLoader.getAllFonts()

const volumeTemplateLoader = new RiachueloVolumeTemplate()
const volumeTemplate = volumeTemplateLoader.getTemplate()

const headerTemplateLoader = new RiachueloVolumeHeader()
const headerTemplate = headerTemplateLoader.getTemplate()

export class RiachueloVolumePDF implements IPDFGenerator {
    private prepareVolumeInputs(data: RiachueloVolumeTagData[]): any[] {
        return data.map(item => ({
            'Tipo Produto': 'Tipo Produto',
            'Quant. Total': 'Quant. Total',
            'Codigo Artigo': 'Codigo Artigo',
            LOJAS: 'LOJAS RIACHUELO S .A',
            META: 'META INDUSTRUA DE CALCADOS LTD',
            Destinatario: 'Destinatario',
            Destino: 'Destino',
            DCO: 'DCO',
            Volumes: 'Volumes',
            Pedido: 'Pedido',
            FORNECEDOR: JSON.stringify({ FORNECEDOR: item.NomeForn }),
            DES_ENDERECO: JSON.stringify({ DES_ENDERECO: item.desEndereco }),
            DES_AUXILIAR_1: JSON.stringify({ DES_AUXILIAR_1: item.desAuxiliar_1 }),
            DES_AUXILIAR_2: JSON.stringify({ DES_AUXILIAR_2: item.desAuxiliar_2 }),
            EAN: JSON.stringify({ EAN: parseInt(item.codMercadoria, 10) }),
            N_PEDIDO: JSON.stringify({ N_PEDIDO: item.PedidoCodigo }),
            VOLUME: JSON.stringify({ VOLUME: item.numVolume }),
            COD_DCO: JSON.stringify({ COD_DCO: item.codDco }),
            DES_CODIGO_DESTINO: JSON.stringify({ DES_CODIGO_DESTINO: item.desCodigoDestino }),
            QTD_TOTAL: JSON.stringify({ QTD_TOTAL: item.qtdeTotal }),
            CodBarra2: item.codBarra,
            CodBarra1: item.codBarraCdAtual,
        }))
    }

    private prepareHeaderInputs(item: RiachueloVolumeTagData) {
        return [
            {
                FORNECEDOR: 'FORNECEDOR : META INDUSTRIA D',
                MATERIAL: 'MATERIAL :',
                REF: 'REF FORN',
                PEDIDO: 'PEDIDO :',
                'ITEM PED': 'ITEM PED :',
                'N:': 'N:',
                N_PEDIDO: JSON.stringify({ N_PEDIDO: item.PedidoCodigo }),
                ITEM: JSON.stringify({ ITEM: item.ItemPedido }),
                CENTRO_FATURAMENTO: JSON.stringify({ CENTRO_FATURAMENTO: item.centrofaturamento }),
                FAIXA: JSON.stringify({ FAIXA: item.itemQuebra.slice(-2) }),
            },
        ]
    }

    private groupByItemAndFaixa(data: RiachueloVolumeTagData[]) {
        return data.reduce((groups, item) => {
            const key = `${item.ItemPedido || ''}-${item.itemQuebra || ''}`
            if (!groups[key]) {
                groups[key] = []
            }
            groups[key].push(item)
            return groups
        }, {} as Record<string, RiachueloVolumeTagData[]>)
    }

    public async generate(outputFileName: string, data: RiachueloVolumeTagData[], quantity?: number): Promise<Buffer> {
        const uploadsDir = path.resolve(__dirname, '../../../../uploads')
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true })
        }

        const filePath = path.join(uploadsDir, outputFileName)

        try {
            const groupedData = this.groupByItemAndFaixa(data)

            const mergedPdfDoc = await PDFDocument.create()

            for (const [key, items] of Object.entries(groupedData)) {
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

                const volumeInputs = this.prepareVolumeInputs(items)
                const volumePdf = await generate({
                    template: volumeTemplate,
                    inputs: volumeInputs,
                    plugins: {
                        multiVariableText,
                        text,
                        barCode: barcodes.code128,
                    },
                    options: {
                        font: font as any,
                    },
                })

                const headerPdfDoc = await PDFDocument.load(headerPdf)
                const volumePdfDoc = await PDFDocument.load(volumePdf)

                const headerPages = await mergedPdfDoc.copyPages(headerPdfDoc, headerPdfDoc.getPageIndices())
                headerPages.forEach(page => mergedPdfDoc.addPage(page))

                const volumePages = await mergedPdfDoc.copyPages(volumePdfDoc, volumePdfDoc.getPageIndices())
                volumePages.forEach(page => mergedPdfDoc.addPage(page))
            }

            const mergedPdfBytes = await mergedPdfDoc.save()

            fs.writeFileSync(filePath, mergedPdfBytes)
            return Buffer.from(mergedPdfBytes)
        } catch (error) {
            console.error('Error to generate  PDF:', error)
            throw new Error('Failed to generte PDF: ' + (error as Error).message)
        }
    }
}
