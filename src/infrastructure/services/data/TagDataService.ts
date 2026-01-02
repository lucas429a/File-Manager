import prisma from '../../../prisma'
import { ConverterFactory } from '../../factories/ConverterFactory'
import crypto from 'crypto'

export class TagDataService {
    async saveToTagsTable(data: any[], companyCode: number, ...tags: string[]) {
        if (!data || data.length === 0) {
            console.log(`Nenhum dado para salvar para o tipo ${tags[0]}`)
            return {
                success: false,
                message: 'Nenhum dado para salvar',
                processedRecords: 0,
            }
        }

        const existCompany = await prisma.empresa.findUnique({
            where: { ID: Number(companyCode) },
        })

        if (!existCompany) {
            console.error(`Empresa com código ${companyCode} não encontrada no banco de dados`)
            return {
                success: false,
                message: `Empresa com código ${companyCode} não encontrada. Verifique se a empresa está cadastrada.`,
                processedRecords: 0,
            }
        }

        const formattedData = data
            .map(entry => {
                const id = crypto.randomUUID()

                if (companyCode === ConverterFactory.calcenterCode) {
                    const tipoEtiqueta = entry.origem === 'corrugado' ? tags[0] : entry.origem === 'frontbox' ? tags[1] : entry.origem === 'palmilha' ? tags[2] : 'desconhecido'

                    const orderNumber = entry['N_PEDIDO'] || entry.orderHeader || null

                    return {
                        id,
                        TipoEtiqueta: tipoEtiqueta,
                        QTD: entry.QTD || null,
                        N_PEDIDO: orderNumber,
                        CODIGO_MASTER: entry['CODIGO MASTER'] || null,
                        CODIGO_DIGITO: entry['CODIGO DIGITO'] || null,
                        FORNECEDOR: entry.FORNECEDOR || null,
                        COR: entry.COR || null,
                        DESCRICAO: entry.DESCRICAO || null,
                        UC: entry.UC || null,
                        GRADE: entry.GRADE || null,
                        GRADE_QTD: entry['GRADE QTD'] || null,
                        TOTAL: entry.TOTAL || null,
                        SEMANA: entry.SEMANA || entry['SEMANA ENTREGA'] || null,
                        NOME_EMPRESA: entry.EMPRESA || null,
                        VOLUME: entry.VOLUME || null,
                        ANO: entry.ANO || null,
                        PROMOCAO: entry.PROMOCAO || null,
                        DEPARTAMENTO: entry.DEPARTAMENTO || null,
                        CODIGO_MATERIAL_SKU: entry['CODIGO MATERIAL SKU'] || null,
                        N_TAMANHO: entry['N TAMANHO'] || null,
                        PRECO_VDA: entry['PRECO VDA'] || null,
                        FAIXA: entry.FAIXA || null,
                        ITEM: entry.ITEM || null,
                        SUBSEGMENTO: entry.SUBSEGMENTO || null,
                        CICLOVIDA: entry.CICLOVIDA || null,
                        EAN: entry.EAN || null,
                        EMPRESA_ID: Number(companyCode),
                    }
                } else if (companyCode === ConverterFactory.besniCode) {
                    return {
                        id,
                        TipoEtiqueta: tags[0],
                        EMPRESA_ID: Number(companyCode),
                        QTD: entry.qtde ? Math.floor(parseInt(entry.qtde.toString().replace(/[,\.].*$/, ''))).toString() : null,
                        COR: entry.cor || null,
                        N_PEDIDO: entry.pedido || null,
                        FORNECEDOR: entry.tema || null,
                        N_TAMANHO: entry.tamanho || null,
                        DEPARTAMENTO: entry.gmerc || null,
                        SEMANA: entry.semana || null,
                        CODIGO_DIGITO: entry.codigo || null,
                        PRECO_VDA: entry.valor || null,
                        EAN: entry.ean13 || null,
                        CODIGO_MATERIAL_SKU: entry.codigock || null,
                        FAIXA: entry.linha || null,
                        DESCRICAO: entry.matforn || null,
                        CICLOVIDA: entry.tend || null,
                        GRADE: entry.padr || null,
                        ITEM: entry.direc || null,
                        SUBSEGMENTO: entry.corforn || null,
                    }
                } else if (companyCode === ConverterFactory.diSantiniCode) {
                    return {
                        id,
                        TipoEtiqueta: tags[0],
                        EMPRESA_ID: Number(companyCode),
                        QTD: entry.QTD || null,
                        N_PEDIDO: entry.nPedido || null,
                        CODIGO_DIGITO: entry.codigoSku || null,
                        DESCRICAO: entry.descricao || null,
                        UC: entry.uc || null,
                        COR: entry.cor || null,
                        ITEM: entry.item || null,
                        N_TAMANHO: entry.tamanho || null,
                        PRECO_VDA: entry.preco || null,
                        GRADE: entry.grade || null,
                        GRADE_QTD: entry.gradeQuantidades || null,
                        DEPARTAMENTO: entry.referencia || null,
                        FAIXA: entry.faixa || null,
                    }
                } else if (companyCode === ConverterFactory.diGaspiCode) {
                    return {
                        id,
                        TipoEtiqueta: tags[0],
                        EMPRESA_ID: Number(companyCode),
                        EAN: entry.EAN || null,
                        QTD: entry.Quantidade || null,
                        PRECO_VDA: entry.Preco || null,
                        DESCRICAO: entry.Descricao || null,
                        SUBSEGMENTO: entry.Subsegmento || null,
                        FORNECEDOR: entry.Fornecedor || null,
                        COR: entry.Cor || null,
                        N_TAMANHO: entry.Tamanho || null,
                        ITEM: entry.Item || null,
                        UC: entry.UC || null,
                        N_PEDIDO: entry.N_PEDIDO || null,
                    }
                } else if (companyCode === ConverterFactory.avenidaCode) {
                    return {
                        id,
                        TipoEtiqueta: tags[0],
                        EMPRESA_ID: Number(companyCode),
                        N_PEDIDO: entry.N_PEDIDO || null,
                        SUBSEGMENTO: entry.SUBSEGMENTO || null,
                        COD_DCO: entry.COD_DCO || null,
                        DEPARTAMENTO: entry.DEPARTAMENTO || null,
                        CENTRO_FATURAMENTO: entry.CENTRO_FATURAMENTO || null,
                        FORNECEDOR: entry.FORNECEDOR || null,
                        DES_CODIGO_DESTINO: entry.DES_CODIGO_DESTINO || null,
                        DES_ENDERECO: entry.DES_ENDERECO || null,
                        COD_BARRA_CD_ATUAL: entry.COD_BARRA_CD_ATUAL || null,
                        UC: entry.UC || null,
                        DESCRICAO: entry.DESCRICAO || null,
                        ITEM: entry.ITEM || null,
                        VOLUME: entry.VOLUME || null,
                        PRECO_VDA: entry.PRECO_VDA || null,
                        QTD_TOTAL: entry.QTD_TOTAL || null,
                        COD_BARRA: entry.COD_BARRA || null,
                        COR: entry.COR || null,
                        N_TAMANHO: entry.N_TAMANHO || null,
                        QTD: entry.QTD || null,
                        DES_AUXILIAR_1: entry.DES_AUXILIAR_1 || null,
                        FAIXA: entry.FAIXA || null,
                        CICLOVIDA: entry.CICLOVIDA || null,
                        CODIGO_DIGITO: entry.CODIGO_DIGITO || null,
                    }
                } else if (companyCode === ConverterFactory.torraCode) {
                    return {
                        id,
                        TipoEtiqueta: tags[0],
                        EMPRESA_ID: Number(companyCode),
                        DESCRICAO: entry.DESCRICAO || null,
                        COD_DCO: entry.COD_DCO || null,
                        COD_BARRA: entry.COD_BARRA || null,
                        SEMANA: entry.SEMANA || null,
                        SUBSEGMENTO: entry.SUBSEGMENTO || null,
                        DEPARTAMENTO: entry.DEPARTAMENTO || null,
                        NOME_EMPRESA: entry.NOME_EMPRESA || null,
                        PRECO_VDA: entry.PRECO_VDA || null,
                        FORNECEDOR: entry.FORNECEDOR || null,
                        N_PEDIDO: entry.N_PEDIDO || null,
                        QTD: entry.QTD || null,
                        CICLOVIDA: entry.CICLOVIDA || null,
                        CENTRO_FATURAMENTO: entry.CENTRO_FATURAMENTO || null,
                        COR: entry.COR || null,
                        N_TAMANHO: entry.N_TAMANHO || null,
                        QTD_TOTAL: entry.QTD_TOTAL || null,
                    }
                } else if (companyCode === ConverterFactory.pernambucanasCode) {
                    return {
                        id,
                        TipoEtiqueta: tags[0],
                        EMPRESA_ID: Number(companyCode),
                        CENTRO_FATURAMENTO: entry.CENTRO_FATURAMENTO || null,
                        FORNECEDOR: entry.FORNECEDOR || null,
                        N_PEDIDO: entry.N_PEDIDO || null,
                        COD_DCO: entry.COD_DCO || null,
                        CICLOVIDA: entry.CICLOVIDA || null,
                        DEPARTAMENTO: entry.DEPARTAMENTO || null,
                        DES_ENDERECO: entry.DES_ENDERECO || null,
                        ITEM: entry.ITEM || null,
                        FAIXA: entry.FAIXA || null,
                        QTD: entry.QTD || null,
                        DESCRICAO: entry.DESCRICAO || null,
                        SUBSEGMENTO: entry.SUBSEGMENTO || null,
                    }
                } else if (companyCode === ConverterFactory.humanitarianCode) {
                    return {
                        id,
                        TipoEtiqueta: tags[0],
                        EMPRESA_ID: Number(companyCode),
                        DESCRICAO: entry.DESCRICAO || null,
                        EAN: entry.EAN || null,
                        FORNECEDOR: entry.FORNECEDOR || null,
                        N_PEDIDO: entry.N_PEDIDO || null,
                        QTD: entry.QTD || null,
                        COR: entry.COR || null,
                        N_TAMANHO: entry.N_TAMANHO || null,
                    }
                } else if (companyCode === ConverterFactory.linsFerraoCode) {
                    return {
                        id,
                        TipoEtiqueta: tags[0],
                        EMPRESA_ID: Number(companyCode),
                        QTD: String(entry.QTD) || null,
                        DESCRICAO: entry.DESCRICAO || null,
                        EAN: entry.EAN || null,
                        FORNECEDOR: entry.FORNECEDOR || null,
                        N_PEDIDO: entry.N_PEDIDO || null,
                        COR: entry.COR || null,
                        N_TAMANHO: entry.N_TAMANHO || null,
                        SUBSEGMENTO: entry.SUBSEGMENTO || null,
                        FAIXA: entry.FAIXA || null,
                        CICLOVIDA: entry.CICLOVIDA || null,
                        PRECO_VDA: entry.PRECO_VDA || null,
                        GRADE: entry.GRADE || null,
                        GRADE_QTD: entry.GRADE_QTD || null,
                        DEPARTAMENTO: entry.DEPARTAMENTO || null,
                        COD_DCO: entry.COD_DCO || null,
                        NOME_EMPRESA: entry.NOME_EMPRESA || null,
                    }
                } else if (companyCode === ConverterFactory.caeduCode) {
                    return {
                        id,
                        TipoEtiqueta: entry.tipoEtiqueta || 'caeduvolume',
                        EMPRESA_ID: Number(companyCode),
                        FAIXA: entry.FAIXA || null,
                        FORNECEDOR: entry.FORNECEDOR || null,
                        N_PEDIDO: entry.N_PEDIDO || null,
                        UC: entry.UC || null,
                        PRECO_VDA: entry.PRECO_VDA || null,
                        QTD: entry.QTD || null,
                        GRADE_QTD: entry.GRADE_QTD || null,
                        COR: entry.COR || null,
                        N_TAMANHO: entry.N_TAMANHO || null,
                        DESCRICAO: entry.DESCRICAO || null,
                        CODIGO_MATERIAL_SKU: entry.CODIGO_MATERIAL_SKU || null,
                        DEPARTAMENTO: entry.DEPARTAMENTO || null,
                        ITEM: entry.ITEM || null,
                        CICLOVIDA: entry.CICLOVIDA || null,
                        SUBSEGMENTO: entry.SUBSEGMENTO || null,
                        COD_DCO: entry.COD_DCO || null,
                        CENTRO_FATURAMENTO: entry.CENTRO_FATURAMENTO || null,
                        GRADE: entry.GRADE || null,
                        VOLUME: entry.VOLUME || null,
                    }
                } else if (companyCode === ConverterFactory.ceaCode) {
                    return {
                        id,
                        TipoEtiqueta: tags[0],
                        EMPRESA_ID: Number(companyCode),
                        N_PEDIDO: entry.N_PEDIDO || null,
                        CODIGO_MASTER: entry.CODIGO_MASTER || null,
                        CODIGO_DIGITO: entry.CODIGO_DIGITO || null,
                        CENTRO_FATURAMENTO: entry.CENTRO_FATURAMENTO || null,
                        UC: entry.UC || null,
                        GRADE: entry.GRADE || null,
                        GRADE_QTD: entry.GRADE_QTD || null,
                        VOLUME: entry.VOLUME || null,
                        N_TAMANHO: entry.N_TAMANHO || null,
                        SEMANA: entry.SEMANA || null,
                        DESCRICAO: entry.DESCRICAO || null,
                        FAIXA: entry.FAIXA || null,
                        ITEM: entry.ITEM || null,
                        PRECO_VDA: entry.PRECO_VDA || null,
                        CICLOVIDA: entry.CICLOVIDA || null,
                        SUBSEGMENTO: entry.SUBSEGMENTO || null,
                        TOTAL: entry.TOTAL || null,
                        ANO: entry.ANO || null,
                        QTD: entry.QTD || null,
                        QUANTIDADE_PECA: entry.QUANTIDADE || null,
                        DES_AUXILIAR_1: entry.DES_AUXILIAR_1 || null,
                        DES_AUXILIAR_2: entry.DES_AUXILIAR_2 || null,
                        EAN: entry.EAN || null,
                    }
                } else {
                    return {
                        id,
                        TipoEtiqueta: tags[0],
                        EMPRESA_ID: Number(companyCode),
                        QTD: tags[0] === 'volume' ? entry.quantidade || '1' : entry.QuantidadeEtiqueta || null,
                        COR: entry.Cor || null,
                        CODIGO_MASTER: entry.MaterialForn || null,
                        N_PEDIDO: entry.PedidoCodigo || null,
                        DESCRICAO: entry.DescricaoMaterial || null,
                        N_TAMANHO: entry.Tamanho || null,
                        DEPARTAMENTO: entry.CodDepto || null,
                        SEMANA: entry.DataEntrega || null,
                        UC: entry.CodigoBureau || null,
                        GRADE: entry.Grade || null,
                        CICLOVIDA: entry.Estacao || null,
                        SUBSEGMENTO: entry.EstrColecao || null,
                        PRECO_VDA: entry.PrecoMaterial || null,
                        CODIGO_DIGITO: entry.Digito || null,
                        FORNECEDOR: entry.NomeForn || null,
                        ITEM: entry.ItemPedido || null,
                        CODIGO_MATERIAL_SKU: entry.CodigoMaterial || null,
                        EAN: entry.codMercadoria || null,
                        VOLUME: entry.numVolume || null,
                        QUANTIDADE_PECA: entry.QuantidadePeca || null,
                        CENTRO_ENTREGA: entry.centroentrega || null,
                        CENTRO_FATURAMENTO: entry.centrofaturamento || null,
                        COD_BARRA_CD_ATUAL: entry.codBarraCdAtual || null,
                        COD_BARRA: entry.codBarra || null,
                        DES_ENDERECO: entry.desEndereco || null,
                        DES_AUXILIAR_1: entry.desAuxiliar_1 || null,
                        DES_AUXILIAR_2: entry.desAuxiliar_2 || null,
                        COD_DCO: entry.codDco || null,
                        DES_CODIGO_DESTINO: entry.desCodigoDestino || null,
                        QTD_TOTAL: entry.qtdeTotal || null,
                        FAIXA: entry.itemQuebra || null,
                    }
                }
            })
            .filter(item => item !== undefined)

        const existingRecordsPromises = formattedData.map(async entry => {
            const whereCondition: Record<string, any> = {
                N_PEDIDO: entry.N_PEDIDO,
                TipoEtiqueta: entry.TipoEtiqueta,
                EMPRESA_ID: entry.EMPRESA_ID,
            }

            const existingRecord = await prisma.eTIQUETAS.findFirst({
                where: whereCondition,
            })

            return { entry, exists: !!existingRecord }
        })

        const existingRecordsResults = await Promise.all(existingRecordsPromises)
        const newData = formattedData.filter((_, index) => !existingRecordsResults[index].exists)

        if (newData.length > 0) {
            try {
                await prisma.eTIQUETAS.createMany({
                    data: newData,
                    skipDuplicates: true,
                })
                console.log(`Salvos com sucesso ${newData.length} registros do tipo ${tags[0]}`)
                return {
                    success: true,
                    message: `Dados processados com sucesso: ${newData.length} registros`,
                    processedRecords: newData.length,
                }
            } catch (error: any) {
                console.error(`Erro ao salvar dados: ${error.message}`)
                throw new Error(`Erro ao salvar dados: ${error.message}`)
            }
        } else {
            return {
                success: false,
                message: 'Nenhum novo dado para salvar',
                processedRecords: 0,
            }
        }
    }
}
