import { CalcenterCorrugadoConverter } from '../usecase/converters/Calcenter/CorrugatedConverter'
import { CalcenterCorrugadoPDF } from '../usecase/generatePDF/Calcenter/CalcenterCorrugatedPDF'
import fs from 'fs'
import { generate } from '@pdfme/generator'

jest.mock('fs')
jest.mock('@pdfme/generator')

describe('CalcenterCorrugadoPDF com Conversão', () => {
    const csvData = `ARQUIVO TXT STUDIOZ - FORNECEDOR 07241148000167 - PEDIDO 2300006702 - CORRUGADO
    QTD;N PEDIDO;CODIGO MASTER;FORNECEDOR;COR;DESCRICAO;UC;GRADE;GRADE QTD;TOTAL;SEMANA;EMPRESA;VOLUME;ANO;PROMOCAO;DEPARTAMENTO;INICIO
    1;2300006702;5195343;22002202 META INDUSTRIA DE CALDOS LTDA;OFF WHITE;SAPATE MAS OLLIE TURIM 409;100000025262269;38  39  40  41  42  43;01  01  03  03  02  02;12;42;STZ-1075-CD;1/52;24;;MASCULINO;
    1;2300006702;5195343;22002202 META INDUSTRIA DE CALDOS LTDA;OFF WHITE;SAPATE MAS OLLIE TURIM 409;100000025262270;38  39  40  41  42  43;01  01  03  03  02  02;12;42;STZ-1075-CD;2/52;24;;MASCULINO;`.trim()

    const keyWord = 'CORRUGADO'

    beforeAll(() => {
        ;(generate as jest.Mock).mockResolvedValue('pdf-buffer')
    })

    test('Geração de PDF correta pelos dados convertidos', async () => {
        const converter = new CalcenterCorrugadoConverter()
        const convertData = converter.parse({ csvData })

        expect(convertData).toEqual([
            {
                QTD: '1',
                'N PEDIDO': '2300006702',
                'CODIGO MASTER': '5195343',
                FORNECEDOR: '22002202 META INDUSTRIA DE CALDOS LTDA',
                COR: 'OFF WHITE',
                DESCRICAO: 'SAPATE MAS OLLIE TURIM 409',
                UC: '100000025262269',
                GRADE: '38  39  40  41  42  43',
                'GRADE QTD': '01  01  03  03  02  02',
                TOTAL: '12',
                SEMANA: '42',
                EMPRESA: 'STZ-1075-CD',
                VOLUME: '1/52',
                ANO: '24',
                PROMOCAO: '',
                DEPARTAMENTO: 'MASCULINO',
            },
            {
                QTD: '1',
                'N PEDIDO': '2300006702',
                'CODIGO MASTER': '5195343',
                FORNECEDOR: '22002202 META INDUSTRIA DE CALDOS LTDA',
                COR: 'OFF WHITE',
                DESCRICAO: 'SAPATE MAS OLLIE TURIM 409',
                UC: '100000025262270',
                GRADE: '38  39  40  41  42  43',
                'GRADE QTD': '01  01  03  03  02  02',
                TOTAL: '12',
                SEMANA: '42',
                EMPRESA: 'STZ-1075-CD',
                VOLUME: '2/52',
                ANO: '24',
                PROMOCAO: '',
                DEPARTAMENTO: 'MASCULINO',
            },
        ])

        const pdfGenerator = new CalcenterCorrugadoPDF()

        const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync')

        await pdfGenerator.generate('output.pdf', convertData)

        expect(writeFileSyncMock).toHaveBeenCalledWith('output.pdf')
    })
})
