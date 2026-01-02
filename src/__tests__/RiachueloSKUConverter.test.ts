import { RiachueloSKUTagConverter } from '../usecase/converters/Riachuelo/RiachueloSKUTagConverter'

const xmlData = `
            <Preco AutorizadoGerarTXT="False">
            <PedidoRiac Codigo="6702425273" TipoEtiqueta="99" VAPPE="2D3D157CEBBCA2483094E5D0DC53CBA7" EtiqCalcadosCaixa="S" LayoutNovo="True">
            <Item Codigo="00050">
            <Variante Codigo="kkkotario">
            <CNPJ>07241148000167</CNPJ>
            <Digito>9</Digito>
            <Catalogo/>
            <Tamanho>38</Tamanho>
            <DataEntrega>1410</DataEntrega>
            <CodDepto>505</CodDepto>
            <DataTransmissao>050924</DataTransmissao>
            <CodigoCoordenado/>
            <Familia/>
            <Tendencia/>
            <Parede/>
            <ValeAPena/>
            <DescricaoMaterial>Tenis Moda Indy Pr001</DescricaoMaterial>
            <CodigoBarra>290000</CodigoBarra>
            <CodigoPromocao/>
            <PrecoMaterial>99,90</PrecoMaterial>
            <Grade>000000014807327001</Grade>
            <MaterialForn> 0</MaterialForn>
            <NomeForn>META INDUSTRIA DE CALCADOS LTD</NomeForn>
            <CodigoBureau>18477</CodigoBureau>
            <SequenciaInicial>00000000</SequenciaInicial>
            <SequenciaFinal>00000009</SequenciaFinal>
            <QuantidadeEtiqueta>10</QuantidadeEtiqueta>
            <centroentrega>C270</centroentrega>
            <descricaocentroentrega>CD GUARULHOS NOVO</descricaocentroentrega>
            <centrofaturamento>C180</centrofaturamento>
            <descricaocentrofaturamento>CD MANAUS</descricaocentrofaturamento>
            <OrigemSolicitacao>N</OrigemSolicitacao>
            <Cor>Preto</Cor>
            <Estacao>--</Estacao>
            <EstrColecao>-</EstrColecao>
            <TipoEtiq>5</TipoEtiq>
            <CorIngles>black</CorIngles>
            <TamanhoIngles>38</TamanhoIngles>
            </Variante>
            </Item>
            <Item Codigo="00100">
            <Variante Codigo="000000014807327002">
            <CNPJ>07241148000167</CNPJ>
            <Digito>9</Digito>
            <Catalogo/>
            <Tamanho>39</Tamanho>
            <DataEntrega>1410</DataEntrega>
            <CodDepto>505</CodDepto>
            <DataTransmissao>050924</DataTransmissao>
            <CodigoCoordenado/>
            <Familia/>
            <Tendencia/>
            <Parede/>
            <ValeAPena/>
            <DescricaoMaterial>Tenis Moda Indy Pr001</DescricaoMaterial>
            <CodigoBarra>290000</CodigoBarra>
            <CodigoPromocao/>
            <PrecoMaterial>99,90</PrecoMaterial>
            <Grade>000000014807327002</Grade>
            <MaterialForn> 0</MaterialForn>
            <NomeForn>META INDUSTRIA DE CALCADOS LTD</NomeForn>
            <CodigoBureau>18477</CodigoBureau>
            <SequenciaInicial>00000000</SequenciaInicial>
            <SequenciaFinal>00000009</SequenciaFinal>
            <QuantidadeEtiqueta>10</QuantidadeEtiqueta>
            <centroentrega>C270</centroentrega>
            <descricaocentroentrega>CD GUARULHOS NOVO</descricaocentroentrega>
            <centrofaturamento>C180</centrofaturamento>
            <descricaocentrofaturamento>CD MANAUS</descricaocentrofaturamento>
            <OrigemSolicitacao>N</OrigemSolicitacao>
            <Cor>Preto</Cor>
            <Estacao>--</Estacao>
            <EstrColecao>-</EstrColecao>
            <TipoEtiq>5</TipoEtiq>
            <CorIngles>black</CorIngles>
            <TamanhoIngles>39</TamanhoIngles>
            </Variante>
            </Item>
            </PedidoRiac>
            </Preco>
            `

describe('RiachueloPriceTagConverter', () => {
    let converter: RiachueloSKUTagConverter

    beforeEach(() => {
        converter = new RiachueloSKUTagConverter()
    })

    it('Deve converter um XML válido para JSON', async () => {
        const input = { xmlData }
        const result = await converter.parse(input)

        expect(result).toHaveLength(2)
        console.log(result)
        expect(result[0]).toEqual({
            pedidoCodigo: '6702425273',
            Tamanho: '38',
            CodDepto: '505',
            grade: 'kkkotario',
            cor: 'Preto',
            DescricaoMaterial: 'Tenis Moda Indy Pr001',
            QuantidadeEtiqueta: '10',
            Digito: '9',
        })
    })
})
