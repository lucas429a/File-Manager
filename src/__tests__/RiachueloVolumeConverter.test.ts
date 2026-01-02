// import { RiachueloVolumeTagConverter, VolumeTagData } from '../usecase/converters/Riachuelo/RiachueloVolumeTagConverter'

// describe('RiachueloVolumeTagConverter', () => {
//     let converter: RiachueloVolumeTagConverter

//     beforeEach(() => {
//         converter = new RiachueloVolumeTagConverter()
//     })

//     it('deve converter o XML corretamente para VolumeTagData', async () => {
//         const xmlData = `
//                         <Volume AutorizadoGerarTXT="False">
//                             <PedidoRiac Codigo="6702465676" TipoEtiqueta="4" VAPPE="2D3D157CEBBCA2483094E5D0DC53CBA7">
//                                 <Loja Codigo="C190" EtiqVolume="false">
//                                     <CNPJ>07241148000167</CNPJ>
//                                     <ItemPedido>00100</ItemPedido>
//                                     <CodigoMaterial>000000015641112002</CodigoMaterial>
//                                     <DescricaoMaterial>Tenis Md C Bx Kings3 F 421 Ilh</DescricaoMaterial>
//                                     <QuantidadePecGrade>0001</QuantidadePecGrade>
//                                     <QuantidadePeca>00000010</QuantidadePeca>
//                                     <MaterialForn>KINGS3-F 421</MaterialForn>
//                                     <NomeForn>META INDUSTRIA DE CALCADOS LTD</NomeForn>
//                                     <CodigoBureau>18477</CodigoBureau>
//                                     <SemanaEntr>16</SemanaEntr>
//                                     <SequenciaInicial>00000000</SequenciaInicial>
//                                     <SequenciaFinal>00000009</SequenciaFinal>
//                                     <QuantidadeEtiqueta>10</QuantidadeEtiqueta>
//                                     <centroentrega>C270</centroentrega>
//                                     <centrofaturamento>C190</centrofaturamento>
//                                     <DADOS_VOLUME>
//                                         <ETIQUETA>
//                                             <numVolume>N. 1/1</numVolume>
//                                             <itemQuebra>Cinza cl-35</itemQuebra>
//                                             <codMercadoria>000000015641112002</codMercadoria>
//                                             <codBarraCdAtual>L15641112002010048</codBarraCdAtual>
//                                             <footerPagina>Cinza cl-35</footerPagina>
//                                             <remNome>META INDUSTRIA DE CALCADOS LTD</remNome>
//                                             <fluxoDeposito>BUF</fluxoDeposito>
//                                             <qtdeTotal>10</qtdeTotal>
//                                             <desCodigoDestino>C190</desCodigoDestino>
//                                             <codDco>500</codDco>
//                                             <destNome>CD NATAL</destNome>
//                                             <desAuxiliar_1>CEP: 59115-900NATAL-RN</desAuxiliar_1>
//                                             <codBarra>T00000036503010</codBarra>
//                                             <desAuxiliar_2>CNPJ: 33200056034396</desAuxiliar_2>
//                                             <detalhesCodBarra>T00000036503010</detalhesCodBarra>
//                                             <desEndereco>ROD BR 101 9000, Bloco B</desEndereco>
//                                             <tipoProduto/>
//                                             <numAuxiliar>6702465676</numAuxiliar>
//                                             <codArtigo>000000015641112002</codArtigo>
//                                         </ETIQUETA>
//                                     </DADOS_VOLUME>
//                                 </Loja>
//                             </PedidoRiac>
//                         </Volume>`

//         const result = await converter.parse({ xmlData })
//         const expected: VolumeTagData[] = [
//             {
//                 nomeForn: 'META INDUSTRIA DE CALCADOS LTD',
//                 pedidoCodigo: '6702465676',
//                 itemPedido: '00100',
//                 codigoMaterial: '000000015641112002',
//                 codMercadoria: '000000015641112002',
//                 descricaoMaterial: 'Tenis Md C Bx Kings3 F 421 Ilh',
//                 quantidadePeca: '00000010',
//                 centroEntrega: 'C270',
//                 centroFaturamento: 'C190',
//                 numVolume: 'N. 1/1',
//                 codBarraCdAtual: 'L15641112002010048',
//                 codBarra: 'T00000036503010',
//                 desEndereco: 'ROD BR 101 9000, Bloco B',
//                 desAuxiliar_1: 'CEP: 59115-900NATAL-RN',
//                 desAuxiliar_2: 'CNPJ: 33200056034396',
//                 codDco: '500',
//                 desCodigoDestino: 'C190',
//                 qtdeTotal: '10',
//             },
//         ]

//         console.log('Resultados de única etiqueta:', result)
//         expect(result).toEqual(expected)
//     })

//     it('deve lançar um erro se o XML for inválido', async () => {
//         const xmlData = `
//             <Volume>
//                 <!-- Estrutura inválida -->
//             </Volume>
//         `

//         await expect(converter.parse({ xmlData })).rejects.toThrow('Formato XML inválido: estrutura esperada não encontrada')
//     })

//     it('deve lidar com multiplas etiquetas dentro de uma loja', async () => {
//         const xmlData = `
//         <Volume AutorizadoGerarTXT="False">
//             <PedidoRiac Codigo="6702465676" TipoEtiqueta="4" VAPPE="2D3D157CEBBCA2483094E5D0DC53CBA7">
//                 <Loja Codigo="C190" EtiqVolume="false">
//                     <CNPJ>07241148000167</CNPJ>
//                     <ItemPedido>00150</ItemPedido>
//                     <CodigoMaterial>000000015641112003</CodigoMaterial>
//                     <DescricaoMaterial>Tenis Md C Bx Kings3 F 421 Ilh</DescricaoMaterial>
//                     <QuantidadePecGrade>0001</QuantidadePecGrade>
//                     <QuantidadePeca>00000040</QuantidadePeca>
//                     <MaterialForn>KINGS3-F 421</MaterialForn>
//                     <NomeForn>META INDUSTRIA DE CALCADOS LTD</NomeForn>
//                     <CodigoBureau>18477</CodigoBureau>
//                     <SemanaEntr>16</SemanaEntr>
//                     <SequenciaInicial>00000000</SequenciaInicial>
//                     <SequenciaFinal>00000041</SequenciaFinal>
//                     <QuantidadeEtiqueta>42</QuantidadeEtiqueta>
//                     <centroentrega>C270</centroentrega>
//                     <centrofaturamento>C190</centrofaturamento>
//                     <DADOS_VOLUME>
//                         <ETIQUETA>
//                             <numVolume>N. 1/4</numVolume>
//                             <itemQuebra>Cinza cl-36</itemQuebra>
//                             <codMercadoria>000000015641112003</codMercadoria>
//                             <codBarraCdAtual>L15641112003010069</codBarraCdAtual>
//                             <footerPagina>Cinza cl-36</footerPagina>
//                             <remNome>META INDUSTRIA DE CALCADOS LTD</remNome>
//                             <fluxoDeposito>BUF</fluxoDeposito>
//                             <qtdeTotal>10</qtdeTotal>
//                             <desCodigoDestino>C190</desCodigoDestino>
//                             <codDco>500</codDco>
//                             <destNome>CD NATAL</destNome>
//                             <desAuxiliar_1>CEP: 59115-900NATAL-RN</desAuxiliar_1>
//                             <codBarra>T00000036503027</codBarra>
//                             <desAuxiliar_2>CNPJ: 33200056034396</desAuxiliar_2>
//                             <detalhesCodBarra>T00000036503027</detalhesCodBarra>
//                             <desEndereco>ROD BR 101 9000, Bloco B</desEndereco>
//                             <tipoProduto/>
//                             <numAuxiliar>6702465676</numAuxiliar>
//                             <codArtigo>000000015641112003</codArtigo>
//                         </ETIQUETA>
//                         <ETIQUETA>
//                             <numVolume>N. 2/4</numVolume>
//                             <itemQuebra>Cinza cl-36</itemQuebra>
//                             <codMercadoria>000000015641112003</codMercadoria>
//                             <codBarraCdAtual>L15641112003010070</codBarraCdAtual>
//                             <footerPagina>Cinza cl-36</footerPagina>
//                             <remNome>META INDUSTRIA DE CALCADOS LTD</remNome>
//                             <fluxoDeposito>BUF</fluxoDeposito>
//                             <qtdeTotal>10</qtdeTotal>
//                             <desCodigoDestino>C190</desCodigoDestino>
//                             <codDco>500</codDco>
//                             <destNome>CD NATAL</destNome>
//                             <desAuxiliar_1>CEP: 59115-900NATAL-RN</desAuxiliar_1>
//                             <codBarra>T00000036503028</codBarra>
//                             <desAuxiliar_2>CNPJ: 33200056034396</desAuxiliar_2>
//                             <detalhesCodBarra>T00000036503028</detalhesCodBarra>
//                             <desEndereco>ROD BR 101 9000, Bloco B</desEndereco>
//                             <tipoProduto/>
//                             <numAuxiliar>6702465676</numAuxiliar>
//                             <codArtigo>000000015641112003</codArtigo>
//                         </ETIQUETA>
//                     </DADOS_VOLUME>
//                 </Loja>
//             </PedidoRiac>
//         </Volume>
//         `

//         const result = await converter.parse({ xmlData })
//         const expected: VolumeTagData[] = [
//             {
//                 nomeForn: 'META INDUSTRIA DE CALCADOS LTD',
//                 pedidoCodigo: '6702465676',
//                 itemPedido: '00150',
//                 codigoMaterial: '000000015641112003',
//                 codMercadoria: '000000015641112003',
//                 descricaoMaterial: 'Tenis Md C Bx Kings3 F 421 Ilh',
//                 quantidadePeca: '00000040',
//                 centroEntrega: 'C270',
//                 centroFaturamento: 'C190',
//                 numVolume: 'N. 1/4',
//                 codBarraCdAtual: 'L15641112003010069',
//                 codBarra: 'T00000036503027',
//                 desEndereco: 'ROD BR 101 9000, Bloco B',
//                 desAuxiliar_1: 'CEP: 59115-900NATAL-RN',
//                 desAuxiliar_2: 'CNPJ: 33200056034396',
//                 codDco: '500',
//                 desCodigoDestino: 'C190',
//                 qtdeTotal: '10',
//             },
//             {
//                 nomeForn: 'META INDUSTRIA DE CALCADOS LTD',
//                 pedidoCodigo: '6702465676',
//                 itemPedido: '00150',
//                 codigoMaterial: '000000015641112003',
//                 codMercadoria: '000000015641112003',
//                 descricaoMaterial: 'Tenis Md C Bx Kings3 F 421 Ilh',
//                 quantidadePeca: '00000040',
//                 centroEntrega: 'C270',
//                 centroFaturamento: 'C190',
//                 numVolume: 'N. 2/4',
//                 codBarraCdAtual: 'L15641112003010070',
//                 codBarra: 'T00000036503028',
//                 desEndereco: 'ROD BR 101 9000, Bloco B',
//                 desAuxiliar_1: 'CEP: 59115-900NATAL-RN',
//                 desAuxiliar_2: 'CNPJ: 33200056034396',
//                 codDco: '500',
//                 desCodigoDestino: 'C190',
//                 qtdeTotal: '10',
//             },
//         ]

//         console.log('multiplas etiquetas :', result)
//         expect(result).toEqual(expected)
//     })
// })
