import { CalcenterFrontBoxConverter } from '../usecase/converters/Calcenter/FrontBoxConverter'

test('Calcenter FrontBox converter', () => {
    const dataEx = `ARQUIVO TXT STUDIOZ - FORNECEDOR 07241148000167 - PEDIDO 2300006702 - FRENTE DE CAIXA DO CALCADO
                    QTD;COR;N TAMANHO;CODIGO DIGITO;DESCRICAO;EAN;CODIGO MATERIAL SKU;PRECO VDA;SEMANA ENTREGA;FAIXA;ANO;PROMOCAO;ITEM;SUBSEGMENTO;CICLOVIDA
                    52;OFF WHITE;38;343;SAPATE MAS OLLIE TURIM 409;7909229643568;5195343038;;42;F2;24;;00020;TRADICIONAL;COL
                    52;OFF WHITE;39;343;SAPATE MAS OLLIE TURIM 409;7909229643575;5195343039;;42;F2;24;;00030;TRADICIONAL;COL`.trim()

    const converter = new CalcenterFrontBoxConverter()

    expect(converter).toBeInstanceOf(CalcenterFrontBoxConverter)

    const result = converter.parse({ csvData: dataEx })

    console.log(result)

    expect(result).toEqual([
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
    ])
})
