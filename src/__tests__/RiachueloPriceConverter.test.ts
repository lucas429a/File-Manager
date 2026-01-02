import { RiachueloPriceTagConverter } from '../usecase/converters/Riachuelo/RiachueloPriceTagConverter'

const xmlData = `<Preco AutorizadoGerarTXT="False">
                <PedidoRiac Codigo="6702465676" TipoEtiqueta="5" VAPPE="2D3D157CEBBCA2483094E5D0DC53CBA7" EtiqCalcadosCaixa="S" LayoutNovo="True">
                <Item Codigo="00050">
                <Variante Codigo="000000015641112001">
                <CNPJ>07241148000167</CNPJ>
                <Digito>0</Digito>
                <Catalogo/>
                <Tamanho>34</Tamanho>
                <DataEntrega>1404</DataEntrega>
                <CodDepto>500</CodDepto>
                <DataTransmissao>150125</DataTransmissao>
                <CodigoCoordenado/>
                <Familia>SOLO</Familia>
                <Tendencia>TENIS</Tendencia>
                <Parede/>
                <ValeAPena/>
                <DescricaoMaterial>Tenis Md C Bx K Cz001</DescricaoMaterial>
                <CodigoBarra>200000</CodigoBarra>
                <CodigoPromocao/>
                <PrecoMaterial>139,90</PrecoMaterial>
                <Grade>000000015641112001</Grade>
                <MaterialForn> 0</MaterialForn>
                <NomeForn>META INDUSTRIA DE CALCADOS LTD</NomeForn>
                <CodigoBureau>18477</CodigoBureau>
                <SequenciaInicial>00000000</SequenciaInicial>
                <SequenciaFinal>00000009</SequenciaFinal>
                <QuantidadeEtiqueta>10</QuantidadeEtiqueta>
                <centroentrega>C270</centroentrega>
                <descricaocentroentrega>CD GUARULHOS NOVO</descricaocentroentrega>
                <centrofaturamento>C190</centrofaturamento>
                <descricaocentrofaturamento>CD NATAL</descricaocentrofaturamento>
                <OrigemSolicitacao>N</OrigemSolicitacao>
                <Cor>Cinza cl</Cor>
                <Estacao>I-TENIS-</Estacao>
                <EstrColecao>SOLO-3-</EstrColecao>
                </Variante>
                </Item>
                <Item Codigo="00100">
                <Variante Codigo="000000015641112002">
                <CNPJ>07241148000167</CNPJ>
                <Digito>8</Digito>
                <Catalogo/>
                <Tamanho>35</Tamanho>
                <DataEntrega>1404</DataEntrega>
                <CodDepto>500</CodDepto>
                <DataTransmissao>150125</DataTransmissao>
                <CodigoCoordenado/>
                <Familia>SOLO</Familia>
                <Tendencia>TENIS</Tendencia>
                <Parede/>
                <ValeAPena/>
                <DescricaoMaterial>Tenis Md C Bx K Cz001</DescricaoMaterial>
                <CodigoBarra>280000</CodigoBarra>
                <CodigoPromocao/>
                <PrecoMaterial>139,90</PrecoMaterial>
                <Grade>000000015641112002</Grade>
                <MaterialForn> 0</MaterialForn>
                <NomeForn>META INDUSTRIA DE CALCADOS LTD</NomeForn>
                <CodigoBureau>18477</CodigoBureau>
                <SequenciaInicial>00000000</SequenciaInicial>
                <SequenciaFinal>00000009</SequenciaFinal>
                <QuantidadeEtiqueta>10</QuantidadeEtiqueta>
                <centroentrega>C270</centroentrega>
                <descricaocentroentrega>CD GUARULHOS NOVO</descricaocentroentrega>
                <centrofaturamento>C190</centrofaturamento>
                <descricaocentrofaturamento>CD NATAL</descricaocentrofaturamento>
                <OrigemSolicitacao>N</OrigemSolicitacao>
                <Cor>Cinza cl</Cor>
                <Estacao>I-TENIS-</Estacao>
                <EstrColecao>SOLO-3-</EstrColecao>
                </Variante>
                </Item>
                </PedidoRiac>
                </Preco>`

describe('RiachueloPriceTagConverter', () => {
    let converter: RiachueloPriceTagConverter

    beforeEach(() => {
        converter = new RiachueloPriceTagConverter()
    })

    it('Deve converter um XML válido para JSON', async () => {
        const input = { xmlData }
        const result = await converter.parse(input)

        expect(result).toHaveLength(2)
        console.log(result)
        expect(result[0]).toEqual({
            pedidoCodigo: '6702465676',
            tamanho: '34',
            codDepto: '500',
            dataEntrega: '1404',
            codigoBureau: '18477',
            grade: '000000015641112001',
            descricaoMaterial: 'Tenis Md C Bx K Cz001',
            cor: 'Cinza cl',
            estacao: 'I-TENIS-',
            estrColecao: 'SOLO-3-',
            precoMaterial: '139,90',
            QuantidadeEtiqueta: '10',
        })
    })
})
