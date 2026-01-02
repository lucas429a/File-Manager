import { BesniPriceConverter } from '../usecase/converters/Besni/BesniPriceConverter'

describe('BesniPriceConverter', () => {
    let converter: BesniPriceConverter

    beforeEach(() => {
        converter = new BesniPriceConverter()
    })

    it('deve converter XML válido para BesniPriceData[]', async () => {
        const xmlData = `
            <DATAPACKET Version="2.0">
                <METADATA>
                <FIELDS>
                <FIELD attrname="semana" fieldtype="string" readonly="true" WIDTH="4"/>
                <FIELD attrname="matforn" fieldtype="string" SUBTYPE="FixedChar" WIDTH="40"/>
                <FIELD attrname="tema" fieldtype="string" SUBTYPE="FixedChar" WIDTH="10"/>
                <FIELD attrname="tend" fieldtype="string" SUBTYPE="FixedChar" WIDTH="10"/>
                <FIELD attrname="padr" fieldtype="string" SUBTYPE="FixedChar" WIDTH="10"/>
                <FIELD attrname="direc" fieldtype="string" SUBTYPE="FixedChar" WIDTH="10"/>
                <FIELD attrname="linha" fieldtype="string" SUBTYPE="FixedChar" WIDTH="10"/>
                <FIELD attrname="tamanho" fieldtype="string" WIDTH="40"/>
                <FIELD attrname="cor" fieldtype="string" WIDTH="40"/>
                <FIELD attrname="corforn" fieldtype="string" WIDTH="18"/>
                <FIELD attrname="gmerc" fieldtype="string" WIDTH="9"/>
                <FIELD attrname="ean13" fieldtype="string" readonly="true" WIDTH="13"/>
                <FIELD attrname="codigo" fieldtype="string" WIDTH="9"/>
                <FIELD attrname="codigock" fieldtype="string" WIDTH="6"/>
                <FIELD attrname="valor" fieldtype="fixed" DECIMALS="2" WIDTH="7"/>
                <FIELD attrname="pedido" fieldtype="i4"/>
                <FIELD attrname="qtde" fieldtype="i4" readonly="true"/>
                </FIELDS>
                </METADATA>
                <ROWDATA>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="28 " cor="GELO " corforn="418 " gmerc="CLMOIF020" ean13="2050010223416 " codigo="690518001 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 10,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="29 " cor="GELO " corforn="418 " gmerc="CLMOIF020" ean13="2050010223423 " codigo="690518002 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 10,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="30 " cor="GELO " corforn="418 " gmerc="CLMOIF020" ean13="2050010223430 " codigo="690518003 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 10,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="31 " cor="GELO " corforn="418 " gmerc="CLMOIF020" ean13="2050010223447 " codigo="690518004 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 10,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="32 " cor="GELO " corforn="418 " gmerc="CLMOIF020" ean13="2050010223454 " codigo="690518005 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 10,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="33 " cor="GELO " corforn="418 " gmerc="CLMOIF020" ean13="2050010223461 " codigo="690518006 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 10,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="34 " cor="GELO " corforn="418 " gmerc="CLMOIF020" ean13="2050010223478 " codigo="690518007 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 20,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="35 " cor="GELO " corforn="418 " gmerc="CLMOIF020" ean13="2050010223485 " codigo="690518008 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 20,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="36 " cor="GELO " corforn="418 " gmerc="CLMOIF020" ean13="2050010223492 " codigo="690518009 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 20,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="28 " cor="CAMEL " corforn="417 " gmerc="CLMOIF020" ean13="2050010666329 " codigo="690518019 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 10,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="29 " cor="CAMEL " corforn="417 " gmerc="CLMOIF020" ean13="2050010666336 " codigo="690518020 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 10,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="30 " cor="CAMEL " corforn="417 " gmerc="CLMOIF020" ean13="2050010666343 " codigo="690518021 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 10,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="31 " cor="CAMEL " corforn="417 " gmerc="CLMOIF020" ean13="2050010666350 " codigo="690518022 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 10,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="32 " cor="CAMEL " corforn="417 " gmerc="CLMOIF020" ean13="2050010666367 " codigo="690518023 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 10,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="33 " cor="CAMEL " corforn="417 " gmerc="CLMOIF020" ean13="2050010666374 " codigo="690518024 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 10,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="34 " cor="CAMEL " corforn="417 " gmerc="CLMOIF020" ean13="2050010666381 " codigo="690518025 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 20,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="35 " cor="CAMEL " corforn="417 " gmerc="CLMOIF020" ean13="2050010666398 " codigo="690518026 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 20,000 "/>
                <ROW semana="" matforn="ROCKY INF " tema=" " tend=" " padr=" " direc=" " linha=" " tamanho="36 " cor="CAMEL " corforn="417 " gmerc="CLMOIF020" ean13="2050010666404 " codigo="690518027 " codigock="690518 " valor=" 139.99 " pedido="4500247353" qtde=" 20,000 "/>
                </ROWDATA>
                </DATAPACKET>
        `

        const result = await converter.parse({ xmlData })

        expect(result).toHaveLength(1)
        expect(result[0]).toEqual({
            semana: '202401',
            matforn: '12345',
            tema: 'CASUAL',
            tend: 'MODERNA',
            padr: 'LISO',
            direc: 'NORTE',
            linha: 'FEMININO',
            tamanho: 'P',
            cor: 'PRETO',
            corforn: 'BLACK',
            gmerc: 'VESTUARIO',
            ean13: '7891234567890',
            codigo: 'ABC123',
            codigock: 'CK456',
            valor: '99.90',
            pedido: 'PED789',
            qtde: '10',
        })
    })

    it('deve lançar erro quando estrutura esperada não é encontrada', async () => {
        const xmlData = `
            <?xml version="1.0" encoding="UTF-8"?>
            <WRONGFORMAT>
                <DATA></DATA>
            </WRONGFORMAT>
        `

        await expect(converter.parse({ xmlData })).rejects.toThrow('Formato XML inválido: estrutura esperada não encontrada')
    })
})
