import { CalcenterCorrugadoConverter } from '../usecase/converters/Calcenter/CorrugatedConverter'

test('Calcenter Corrugado Converter', () => {
    const dataEx = ` ARQUIVO TXT STUDIOZ - FORNECEDOR 07241148000167 - PEDIDO 2300006702 - CORRUGADO
    QTD;N PEDIDO;CODIGO MASTER;FORNECEDOR;COR;DESCRICAO;UC;GRADE;GRADE QTD;TOTAL;SEMANA;EMPRESA;VOLUME;ANO;PROMOCAO;DEPARTAMENTO;INICIO
    1;2300006702;5195343;22002202 META INDUSTRIA DE CALDOS LTDA;OFF WHITE;SAPATE MAS OLLIE TURIM 409;100000025262269;38  39  40  41  42  43;01  01  03  03  02  02;12;42;STZ-1075-CD;1/52;24;;MASCULINO;
    1;2300006702;5195343;22002202 META INDUSTRIA DE CALDOS LTDA;OFF WHITE;SAPATE MAS OLLIE TURIM 409;100000025262270;38  39  40  41  42  43;01  01  03  03  02  02;12;42;STZ-1075-CD;2/52;24;;MASCULINO;
    1;2300006702;5195343;22002202 META INDUSTRIA DE CALDOS LTDA;OFF WHITE;SAPATE MAS OLLIE TURIM 409;100000025262271;38  39  40  41  42  43;01  01  03  03  02  02;12;42;STZ-1075-CD;3/52;24;;MASCULINO;
    1;2300006702;5195343;22002202 META INDUSTRIA DE CALDOS LTDA;OFF WHITE;SAPATE MAS OLLIE TURIM 409;100000025262272;38  39  40  41  42  43;01  01  03  03  02  02;12;42;STZ-1075-CD;4/52;24;;MASCULINO;
    1;2300006702;5195343;22002202 META INDUSTRIA DE CALDOS LTDA;OFF WHITE;SAPATE MAS OLLIE TURIM 409;100000025262273;38  39  40  41  42  43;01  01  03  03  02  02;12;42;STZ-1075-CD;5/52;24;;MASCULINO;`.trim()

    const converter = new CalcenterCorrugadoConverter()

    expect(converter).toBeInstanceOf(CalcenterCorrugadoConverter)

    const result = converter.parse({ csvData: dataEx })

    expect(result).toEqual([
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
        {
            QTD: '1',
            'N PEDIDO': '2300006702',
            'CODIGO MASTER': '5195343',
            FORNECEDOR: '22002202 META INDUSTRIA DE CALDOS LTDA',
            COR: 'OFF WHITE',
            DESCRICAO: 'SAPATE MAS OLLIE TURIM 409',
            UC: '100000025262271',
            GRADE: '38  39  40  41  42  43',
            'GRADE QTD': '01  01  03  03  02  02',
            TOTAL: '12',
            SEMANA: '42',
            EMPRESA: 'STZ-1075-CD',
            VOLUME: '3/52',
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
            UC: '100000025262272',
            GRADE: '38  39  40  41  42  43',
            'GRADE QTD': '01  01  03  03  02  02',
            TOTAL: '12',
            SEMANA: '42',
            EMPRESA: 'STZ-1075-CD',
            VOLUME: '4/52',
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
            UC: '100000025262273',
            GRADE: '38  39  40  41  42  43',
            'GRADE QTD': '01  01  03  03  02  02',
            TOTAL: '12',
            SEMANA: '42',
            EMPRESA: 'STZ-1075-CD',
            VOLUME: '5/52',
            ANO: '24',
            PROMOCAO: '',
            DEPARTAMENTO: 'MASCULINO',
        },
    ])
})
