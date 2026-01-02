import { CalcenterFrontBoxConverter } from '../usecase/converters/Calcenter/FrontBoxConverter'
import { CalcenterFrontBoxPDF } from '../usecase/generatePDF/Calcenter/CalcenterFrontBoxPDF'
import fs from 'fs'
import { generate } from '@pdfme/generator'

jest.mock('fs')
jest.mock('@pdfme/generator')

describe('CalcenterFrontBxo com conversão ', () => {
    const csvData = `ARQUIVO TXT STUDIOZ - FORNECEDOR 07241148000167 - PEDIDO 2300006702 - FRENTE DE CAIXA DO CALCADO
                    QTD;COR;N TAMANHO;CODIGO DIGITO;DESCRICAO;EAN;CODIGO MATERIAL SKU;PRECO VDA;SEMANA ENTREGA;FAIXA;ANO;PROMOCAO;ITEM;SUBSEGMENTO;CICLOVIDA
                    52;OFF WHITE;38;343;SAPATE MAS OLLIE TURIM 409;7909229643568;5195343038;;42;F2;24;;00020;TRADICIONAL;COL
                    52;OFF WHITE;39;343;SAPATE MAS OLLIE TURIM 409;7909229643575;5195343039;;42;F2;24;;00030;TRADICIONAL;COL
                    156;OFF WHITE;40;343;SAPATE MAS OLLIE TURIM 409;7909229643582;5195343040;;42;F2;24;;00040;TRADICIONAL;COL`.trim()

    const keyWord = 'FRENTE DE CAIXA DO CALCADO'

    beforeAll(() => {
        ;(generate as jest.Mock).mockResolvedValue('pdf-buffer')
    })

    test('Geração de PDF com dados convertidos', async () => {
        const converter = new CalcenterFrontBoxConverter()
        const converterData = converter.parse({ csvData })

        expect(converterData).toEqual([
            {
                QTD: '52',
                COR: 'OFF WHITE',
                'N TAMANHO': '38',
                'CODIGO DIGITO': '343',
                DESCRICAO: 'SAPATE MAS OLLIE TURIM 409',
                EAN: '7909229643568',
                'CODIGO MATERIAL SKU': '5195343038',
                'PRECO VDA': '',
                'SEMANA ENTREGA': '42',
                FAIXA: 'F2',
                ANO: '24',
                PROMOCAO: '',
                ITEM: '00020',
                SUBSEGMENTO: 'TRADICIONAL',
                CICLOVIDA: 'COL',
            },
            {
                QTD: '52',
                COR: 'OFF WHITE',
                'N TAMANHO': '39',
                'CODIGO DIGITO': '343',
                DESCRICAO: 'SAPATE MAS OLLIE TURIM 409',
                EAN: '7909229643575',
                'CODIGO MATERIAL SKU': '5195343039',
                'PRECO VDA': '',
                'SEMANA ENTREGA': '42',
                FAIXA: 'F2',
                ANO: '24',
                PROMOCAO: '',
                ITEM: '00030',
                SUBSEGMENTO: 'TRADICIONAL',
                CICLOVIDA: 'COL',
            },
            {
                QTD: '156',
                COR: 'OFF WHITE',
                'N TAMANHO': '40',
                'CODIGO DIGITO': '343',
                DESCRICAO: 'SAPATE MAS OLLIE TURIM 409',
                EAN: '7909229643582',
                'CODIGO MATERIAL SKU': '5195343040',
                'PRECO VDA': '',
                'SEMANA ENTREGA': '42',
                FAIXA: 'F2',
                ANO: '24',
                PROMOCAO: '',
                ITEM: '00040',
                SUBSEGMENTO: 'TRADICIONAL',
                CICLOVIDA: 'COL',
            },
        ])

        const pdfGenerator = new CalcenterFrontBoxPDF()

        console.log(pdfGenerator)

        const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync')

        await pdfGenerator.generate('output.pdf', converterData)

        expect(writeFileSyncMock).toHaveBeenCalledWith('output.pdf', 'pdf-buffer')
    })
})
