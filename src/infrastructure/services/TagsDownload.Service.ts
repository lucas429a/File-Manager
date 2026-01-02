import prisma from '../../prisma'
import { CSVData } from '../converters/companies/Calcenter/CorrugatedConverter'
import { CSVDataFrontBox } from '../converters/companies/Calcenter/FrontBoxConverter'
import { CSVDataInsole } from '../converters/companies/Calcenter/InsoleConverter'
import { RiachueloTagPriceData } from '../converters/companies/Riachuelo/RiachueloPriceTagConverter'
import { RiachueloSKUTagData } from '../converters/companies/Riachuelo/RiachueloSKUTagConverter'
import { RiachueloVolumeTagData } from '../converters/companies/Riachuelo/RiachueloVolumeTagConverter'
import { BesniPriceData } from '../converters/companies/Besni/BesniPriceConverter'
import { DiGaspiTagData } from '../converters/companies/DiGaspi/DiGaspiTagConverter'
import { DiSantinniPackData } from '../converters/companies/DiSantini/DiSantiniPackConverter'
import { DiSantiniPriceSkuData } from '../converters/companies/DiSantini/DiSantiniPriceSkuConverter'
import { CalcenterTagData } from '../pdf-generators/companies/Calcenter/CalcenterTagPDF'
import { AvenidaTagData } from '../converters/companies/Avenida/AvenidaTagConverter'
import { TorraTagData } from '../converters/companies/Torra/TorraTagConverter'
import { HumanitarianTagData } from '../converters/companies/Humanitarian/HumanitarianConverter'
import { PernambucanasTagData } from '../converters/companies/Pernambucanas/PernambucanasTagConverter'
import { LinsFerraoPriceData } from '../converters/companies/LinsFerrao/LinsFerraoPriceConverter'
import { LinsFerraoVolumeData } from '../converters/companies/LinsFerrao/LinsFerraoVolume'
import { CaeduVolumeData } from '../converters/companies/Caedu/CaeduVolumeConverter'
import { CaeduPriceData } from '../converters/companies/Caedu/CaeduPriceConverter'
import { CeAPriceData } from '../converters/companies/CeA/CeAPriceConverter'
import { CeAPackData } from '../converters/companies/CeA/CeAPackConverter'

export class TagsService {
    async getTagsByType(
        companyCode: number,
        tipoEtiqueta: string,
        orderNumber?: string,
        size?: string,
        id?: string,
    ): Promise<
        | CSVData[]
        | CSVDataFrontBox[]
        | CSVDataInsole[]
        | RiachueloTagPriceData[]
        | RiachueloSKUTagData[]
        | RiachueloVolumeTagData[]
        | BesniPriceData[]
        | DiGaspiTagData[]
        | DiSantinniPackData[]
        | DiSantiniPriceSkuData[]
        | CalcenterTagData[]
        | AvenidaTagData[]
        | TorraTagData[]
        | HumanitarianTagData[]
        | PernambucanasTagData[]
        | LinsFerraoPriceData[]
        | LinsFerraoVolumeData[]
        | CaeduVolumeData[]
        | CaeduPriceData[]
        | CeAPriceData[]
        | CeAPackData[]
    > {
        try {
            const whereClause: any = {
                EMPRESA_ID: companyCode,
            }

            let dbTipoEtiqueta = tipoEtiqueta
            if (tipoEtiqueta === 'pricedisantinni') {
                dbTipoEtiqueta = 'skuprice'
            }

            if (tipoEtiqueta === 'calcenterTag') {
                dbTipoEtiqueta = 'frontbox'
            }

            if (tipoEtiqueta) {
                whereClause.TipoEtiqueta = {
                    equals: dbTipoEtiqueta.trim(),
                    mode: 'insensitive',
                }
            }

            if (orderNumber) {
                whereClause.N_PEDIDO = {
                    equals: orderNumber.trim(),
                    mode: 'insensitive',
                }
            }

            if (size) {
                whereClause['N_TAMANHO'] = {
                    contains: size.trim(),
                    mode: 'insensitive',
                }
            }

            if (id) {
                whereClause.id = id
            }

            const tags = await prisma.eTIQUETAS.findMany({
                where: whereClause,
            })

            const type = tipoEtiqueta.toLowerCase()

            let result
            switch (type) {
                case 'corrugado':
                    result = this.mapToCalcenterCorrugadoFormat(tags)
                    break
                case 'frontbox':
                    result = this.mapToCalcenterFrontBoxFormat(tags)
                    break
                case 'palmilha':
                    result = this.mapToCalcenterInsoleFormat(tags)
                    break
                case 'price':
                    result = this.mapToRiachueloPriceFormat(tags)
                    break
                case 'volume':
                    result = this.mapToRiachueloVolumeFormat(tags)
                    break
                case 'sku':
                    result = this.mapToRiachueloSKUFormat(tags)
                    break
                case 'pricebesni':
                    result = this.mapToBesniPriceFormat(tags)
                    break
                case 'pricedigaspi':
                    result = this.mapToDiGaspiPriceFormat(tags)
                    break
                case 'pack':
                    result = this.mapToDiSantinniPackFormat(tags)
                    break
                case 'skuprice':
                    result = this.mapToDiSantinniSKUFormat(tags)
                    break
                case 'pricedisantinni':
                    result = this.mapToDiSantinniSKUFormat(tags)
                    break
                case 'calcentertag':
                    result = this.mapToCalcenterTagFormat(tags)
                    break
                case 'avenidaprice':
                    result = this.mapToAvenidaPriceFormat(tags)
                    break
                case 'avenidapack':
                    result = this.mapToAvenidaPriceFormat(tags)
                    break
                case 'avenidainsole':
                    result = this.mapToAvenidaPriceFormat(tags)
                    break
                case 'torratag':
                    result = this.mapToTorraTagFormat(tags)
                    break
                case 'humanitarian':
                    result = this.mapToHumanitarianTagFormat(tags)
                    break
                case 'pernambucanastag':
                    result = this.mapToPernambucanasTagFormat(tags)
                    break
                case 'lfprice':
                    result = this.mapToLinsFerraoPriceFormat(tags)
                    break
                case 'lfvolume':
                    result = this.mapToLinsFerraoVolumeFormat(tags)
                    break
                case 'caeduvolume':
                    result = this.mapToCaeduVolumeFormat(tags)
                    break
                case 'caeduprice':
                    result = this.mapToCaeduPriceFormat(tags)
                    break
                case 'caedunoprice':
                    result = this.mapToCaeduPriceFormat(tags)
                    break
                case 'ceaprice':
                    result = this.mapToCeAPriceFormat(tags)
                    break
                case 'ceapack':
                    result = this.mapToCeAPackFormat(tags)
                    break
                default:
                    throw new Error(`Tipo de etiqueta não suportado: ${tipoEtiqueta}`)
            }

            return result
        } catch (error: any) {
            console.error('❌ ERRO NA BUSCA DE TAGS')
            console.error('Erro detalhado:', error)
            console.error('Stack trace:', error.stack)
            throw new Error(`Erro ao buscar dados: ${error.message}`)
        }
    }

    async getTagById(id: string): Promise<any | null> {
        try {
            const tag = await prisma.eTIQUETAS.findUnique({
                where: { id },
            })

            if (!tag) {
                return null
            }

            const type = tag.TipoEtiqueta?.toLowerCase() || ''

            let result
            switch (type) {
                case 'corrugado':
                    result = this.mapToCalcenterCorrugadoFormat([tag])[0]
                    break
                case 'frontbox':
                    result = this.mapToCalcenterFrontBoxFormat([tag])[0]
                    break
                case 'palmilha':
                    result = this.mapToCalcenterInsoleFormat([tag])[0]
                    break
                case 'price':
                    result = this.mapToRiachueloPriceFormat([tag])[0]
                    break
                case 'volume':
                    result = this.mapToRiachueloVolumeFormat([tag])[0]
                    break
                case 'sku':
                    result = this.mapToRiachueloSKUFormat([tag])[0]
                    break
                case 'pricebesni':
                    result = this.mapToBesniPriceFormat([tag])[0]
                    break
                case 'pricedigaspi':
                    result = this.mapToDiGaspiPriceFormat([tag])[0]
                    break
                case 'pack':
                    result = this.mapToDiSantinniPackFormat([tag])[0]
                    break
                case 'skuprice':
                    result = this.mapToDiSantinniSKUFormat([tag])[0]
                    break
                case 'calcentertag':
                    result = this.mapToCalcenterTagFormat([tag])[0]
                    break
                case 'avenidaprice':
                case 'avenidapack':
                case 'avenidainsole':
                    result = this.mapToAvenidaPriceFormat([tag])[0]
                    break
                case 'torratag':
                    result = this.mapToTorraTagFormat([tag])[0]
                    break
                case 'humanitarian':
                    result = this.mapToHumanitarianTagFormat([tag])[0]
                    break
                case 'pernambucanastag':
                    result = this.mapToPernambucanasTagFormat([tag])[0]
                    break
                case 'lfprice':
                    result = this.mapToLinsFerraoPriceFormat([tag])[0]
                    break
                case 'lfvolume':
                    result = this.mapToLinsFerraoVolumeFormat([tag])[0]
                    break
                case 'caeduvolume':
                    result = this.mapToCaeduVolumeFormat([tag])[0]
                    break
                case 'caeduprice':
                case 'caedunoprice':
                    result = this.mapToCaeduPriceFormat([tag])[0]
                    break
                case 'ceaprice':
                    result = this.mapToCeAPriceFormat([tag])[0]
                    break
                case 'ceapack':
                    result = this.mapToCeAPackFormat([tag])[0]
                    break
                default:
                    throw new Error(`Tipo de etiqueta não suportado: ${type}`)
            }

            return result
        } catch (error: any) {
            console.error('❌ ERRO NA BUSCA DE TAG POR ID')
            console.error('Erro detalhado:', error)
            throw new Error(`Erro ao buscar tag por ID: ${error.message}`)
        }
    }

    private mapToCalcenterCorrugadoFormat(tags: any[]): CSVData[] {
        return tags.map(tag => ({
            QTD: tag.QTD || '',
            'N PEDIDO': tag.N_PEDIDO || '',
            'CODIGO MASTER': tag.CODIGO_MASTER || '',
            FORNECEDOR: tag.FORNECEDOR || '',
            COR: tag.COR || '',
            DESCRICAO: tag.DESCRICAO.slice(0, 25) || '',
            UC: tag.UC || '',
            GRADE: tag.GRADE || '',
            'GRADE QTD': tag.GRADE_QTD || '',
            TOTAL: tag.TOTAL || '',
            SEMANA: tag.SEMANA || '',
            EMPRESA: tag.NOME_EMPRESA || '',
            VOLUME: tag.VOLUME || '',
            ANO: tag.ANO || '',
            PROMOCAO: tag.PROMOCAO || '',
            DEPARTAMENTO: tag.DEPARTAMENTO || '',
        }))
    }

    private mapToCalcenterFrontBoxFormat(tags: any[]): CSVDataFrontBox[] {
        return tags.map(tag => ({
            QTD: tag.QTD || '',
            COR: tag.COR || '',
            'N TAMANHO': tag.N_TAMANHO || '',
            'CODIGO DIGITO': tag.CODIGO_DIGITO || '',
            DESCRICAO: tag.DESCRICAO || '',
            EAN: tag.EAN || '',
            'CODIGO MATERIAL SKU': tag.CODIGO_MATERIAL_SKU || '',
            'PRECO VDA': tag.PRECO_VDA || '',
            'SEMANA ENTREGA': tag.SEMANA || '',
            FAIXA: tag.FAIXA || '',
            ANO: tag.ANO || '',
            PROMOCAO: tag.PROMOCAO || '',
            ITEM: tag.ITEM || '',
            SUBSEGMENTO: tag.SUBSEGMENTO || '',
            CICLOVIDA: tag.CICLOVIDA || '',
        }))
    }

    private mapToCalcenterInsoleFormat(tags: any[]): CSVDataInsole[] {
        return tags.map(tag => ({
            QTD: tag.QTD || '',
            COR: tag.COR || '',
            DESCRICAO: tag.DESCRICAO || '',
            EAN: tag.EAN || '',
            'CODIGO MATERIAL SKU': tag.CODIGO_MATERIAL_SKU || '',
            'CODIGO MASTER': tag.CODIGO_MASTER || '',
            'N TAMANHO': tag.N_TAMANHO || '',
            'CODIGO DIGITO': tag.CODIGO_DIGITO || '',
        }))
    }

    private mapToRiachueloPriceFormat(tags: any[]): RiachueloTagPriceData[] {
        return tags.map(tag => ({
            Grade: tag.GRADE || '',
            CodDepto: tag.DEPARTAMENTO || '',
            CodigoBureau: tag.UC || '',
            Cor: tag.COR || '',
            MaterialForn: tag.CODIGO_MASTER || '',
            DataEntrega: tag.SEMANA || '',
            DescricaoMaterial: tag.DESCRICAO || '',
            Digito: tag.CODIGO_DIGITO || '',
            Estacao: tag.CICLOVIDA || '',
            EstrColecao: tag.SUBSEGMENTO || '',
            PedidoCodigo: tag.N_PEDIDO || '',
            PrecoMaterial: tag.PRECO_VDA || '',
            QuantidadeEtiqueta: tag.QTD || '',
            Tamanho: tag.N_TAMANHO || '',
        }))
    }

    private mapToRiachueloVolumeFormat(tags: any[]): RiachueloVolumeTagData[] {
        return tags.map(tag => ({
            centroentrega: tag.CENTRO_ENTREGA || '',
            centrofaturamento: tag.CENTRO_FATURAMENTO || '',
            codBarra: tag.COD_BARRA || '',
            codBarraCdAtual: tag.COD_BARRA_CD_ATUAL || '',
            codDco: tag.COD_DCO || '',
            codDepto: tag.COD_DEPTO || '',
            PedidoCodigo: tag.N_PEDIDO || '',
            qtdeTotal: tag.QTD_TOTAL || '',
            QuantidadePeca: tag.QUANTIDADE_PECA || '',
            CodigoMaterial: tag.CODIGO_MATERIAL_SKU || '',
            codMercadoria: tag.EAN || '',
            desAuxiliar_1: tag.DES_AUXILIAR_1 || '',
            desAuxiliar_2: tag.DES_AUXILIAR_2 || '',
            desCodigoDestino: tag.DES_CODIGO_DESTINO || '',
            DescricaoMaterial: tag.DESCRICAO || '',
            desEndereco: tag.DES_ENDERECO || '',
            ItemPedido: tag.ITEM || '',
            itemQuebra: tag.FAIXA || '',
            NomeForn: tag.FORNECEDOR || '',
            numVolume: tag.VOLUME || '',
            quantidade: tag.Quantidade || '1',
        }))
    }

    private mapToRiachueloSKUFormat(tags: any[]): RiachueloSKUTagData[] {
        return tags.map(tag => ({
            Grade: tag.GRADE || '',
            CodDepto: tag.DEPARTAMENTO || '',
            Cor: tag.COR || '',
            DescricaoMaterial: tag.DESCRICAO || '',
            Digito: tag.CODIGO_DIGITO || '',
            PedidoCodigo: tag.N_PEDIDO || '',
            QuantidadeEtiqueta: tag.QTD || '',
            Tamanho: tag.N_TAMANHO || '',
        }))
    }

    private mapToBesniPriceFormat(tags: any[]): BesniPriceData[] {
        return tags.map(tags => ({
            qtde: tags.QTD || '',
            cor: tags.COR || '',
            pedido: tags.N_PEDIDO || '',
            matforn: tags.DESCRICAO || '',
            tamanho: tags.N_TAMANHO || '',
            gmerc: tags.DEPARTAMENTO || '',
            semana: tags.SEMANA || '',
            codigo: tags.CODIGO_DIGITO || '',
            valor: tags.PRECO_VDA || '',
            ean13: tags.EAN || '',
            codigock: tags.CODIGO_MATERIAL_SKU || '',
            linha: tags.FAIXA || '',
            tema: tags.FORNECEDOR || '',
            tend: tags.CICLOVIDA || '',
            padr: tags.GRADE || '',
            direc: tags.ITEM || '',
            corforn: tags.SUBSEGMENTO || '',
        }))
    }

    private mapToDiGaspiPriceFormat(tags: any[]): DiGaspiTagData[] {
        return tags.map(tag => ({
            Quantidade: tag.QTD || '',
            Cor: tag.COR || '',
            Descricao: tag.DESCRICAO || '',
            EAN: tag.EAN || '',
            Fornecedor: tag.FORNECEDOR || '',
            Item: tag.ITEM || '',
            Preco: tag.PRECO_VDA || '',
            Subsegmento: tag.SUBSEGMENTO || '',
            Tamanho: tag.N_TAMANHO || '',
            UC: tag.UC || '',
            N_PEDIDO: tag.N_PEDIDO || '',
        }))
    }

    private mapToDiSantinniPackFormat(tags: any[]): DiSantinniPackData[] {
        return tags.map(tag => ({
            cor: tag.COR || '',
            descricao: tag.DESCRICAO || '',
            grade: tag.GRADE || '',
            gradeQuantidades: tag.GRADE_QTD || '',
            referencia: tag.DEPARTAMENTO || '',
            codigoSku: tag.CODIGO_DIGITO || '',
            item: tag.ITEM || '',
            uc: tag.UC || '',
        }))
    }

    private mapToDiSantinniSKUFormat(tags: any[]): DiSantiniPriceSkuData[] {
        return tags.map(tag => ({
            cor: tag.COR || '',
            descricao: tag.DESCRICAO || '',
            codigoSku: tag.CODIGO_DIGITO || '',
            tamanho: tag.N_TAMANHO || '',
            preco: tag.PRECO_VDA || '',
            referencia: tag.DEPARTAMENTO || '',
            item: tag.ITEM || '',
            nPedido: tag.N_PEDIDO || '',
            QTD: tag.QTD || '',
            uc: tag.UC || '',
            faixa: tag.FAIXA || '',
        }))
    }

    private mapToCalcenterTagFormat(tags: any[]): CalcenterTagData[] {
        return tags.map(tag => ({
            QTD: tag.QTD || '',
            COR: tag.COR || '',
            'N TAMANHO': tag.N_TAMANHO || '',
            'CODIGO DIGITO': tag.CODIGO_DIGITO || '',
            DESCRICAO: tag.DESCRICAO || '',
            EAN: tag.EAN || '',
            'CODIGO MATERIAL SKU': tag.CODIGO_MATERIAL_SKU || '',
            'PRECO VDA': tag.PRECO_VDA || '',
        }))
    }

    private mapToAvenidaPriceFormat(tags: any[]): AvenidaTagData[] {
        return tags.map(tag => ({
            CENTRO_FATURAMENTO: tag.CENTRO_FATURAMENTO || '',
            COD_BARRA: tag.COD_BARRA || '',
            COD_BARRA_CD_ATUAL: tag.COD_BARRA_CD_ATUAL || '',
            COD_DCO: tag.COD_DCO || '',
            COR: tag.COR || '',
            DEPARTAMENTO: tag.DEPARTAMENTO || '',
            DES_CODIGO_DESTINO: tag.DES_CODIGO_DESTINO || '',
            DES_ENDERECO: tag.DES_ENDERECO || '',
            DESCRICAO: tag.DESCRICAO || '',
            FORNECEDOR: tag.FORNECEDOR || '',
            ITEM: tag.ITEM || '',
            N_PEDIDO: tag.N_PEDIDO || '',
            N_TAMANHO: tag.N_TAMANHO || '',
            PRECO_VDA: tag.PRECO_VDA || '',
            QTD_TOTAL: tag.QTD_TOTAL || '',
            VOLUME: tag.VOLUME || '',
            QTD: tag.QTD || '',
            SUBSEGMENTO: tag.SUBSEGMENTO || '',
            UC: tag.UC || '',
            DES_AUXILIAR_1: tag.DES_AUXILIAR_1 || '',
            FAIXA: tag.FAIXA || '',
            CICLOVIDA: tag.CICLOVIDA || '',
            CODIGO_DIGITO: tag.CODIGO_DIGITO || '',
        }))
    }

    private mapToTorraTagFormat(tags: any[]): TorraTagData[] {
        return tags.map(tag => ({
            CENTRO_FATURAMENTO: tag.CENTRO_FATURAMENTO || '',
            COD_BARRA: tag.COD_BARRA || '',
            COD_DCO: tag.COD_DCO || '',
            COR: tag.COR || '',
            DEPARTAMENTO: tag.DEPARTAMENTO || '',
            DESCRICAO: tag.DESCRICAO || '',
            FORNECEDOR: tag.FORNECEDOR || '',
            N_PEDIDO: tag.N_PEDIDO || '',
            N_TAMANHO: tag.N_TAMANHO || '',
            PRECO_VDA: tag.PRECO_VDA || '',
            QTD_TOTAL: tag.QTD_TOTAL || '',
            QTD: tag.QTD || '',
            SUBSEGMENTO: tag.SUBSEGMENTO || '',
            FAIXA: tag.FAIXA || '',
            CICLOVIDA: tag.CICLOVIDA || '',
            NOME_EMPRESA: tag.NOME_EMPRESA || '',
            SEMANA: tag.SEMANA || '',
        }))
    }

    private mapToHumanitarianTagFormat(tags: any[]): HumanitarianTagData[] {
        return tags.map(tag => ({
            EAN: tag.EAN || '',
            FORNECEDOR: tag.FORNECEDOR || '',
            QTD: tag.QTD || '',
            COR: tag.COR || '',
            N_TAMANHO: tag.N_TAMANHO || '',
            N_PEDIDO: tag.N_PEDIDO || '',
            DESCRICAO: tag.DESCRICAO || '',
        }))
    }

    private mapToPernambucanasTagFormat(tags: any[]): PernambucanasTagData[] {
        return tags.map(tag => ({
            CENTRO_FATURAMENTO: tag.CENTRO_FATURAMENTO || '',
            FORNECEDOR: tag.FORNECEDOR || '',
            N_PEDIDO: tag.N_PEDIDO || '',
            COD_DCO: tag.COD_DCO || '',
            CICLOVIDA: tag.CICLOVIDA || '',
            DEPARTAMENTO: tag.DEPARTAMENTO || '',
            DES_ENDERECO: tag.DES_ENDERECO || '',
            ITEM: tag.ITEM || '',
            DESCRICAO: tag.DESCRICAO || '',
            FAIXA: tag.FAIXA || '',
            QTD: tag.QTD || '',
            SUBSEGMENTO: tag.SUBSEGMENTO || '',
        }))
    }

    private mapToLinsFerraoPriceFormat(tags: any[]): LinsFerraoPriceData[] {
        return tags.map(tag => ({
            CICLOVIDA: tag.CICLOVIDA || '',
            COR: tag.COR || '',
            DESCRICAO: tag.DESCRICAO || '',
            EAN: tag.EAN || '',
            FAIXA: tag.FAIXA || '',
            FORNECEDOR: tag.FORNECEDOR || '',
            GRADE: tag.GRADE || '',
            N_TAMANHO: tag.N_TAMANHO || '',
            PRECO_VDA: tag.PRECO_VDA || '',
            SUBSEGMENTO: tag.SUBSEGMENTO || '',
            NOME_EMPRESA: tag.NOME_EMPRESA || '',
            QTD: tag.QTD || '',
            N_PEDIDO: tag.N_PEDIDO || '',
        }))
    }

    private mapToLinsFerraoVolumeFormat(tags: any[]): LinsFerraoVolumeData[] {
        return tags.map(tag => ({
            CICLOVIDA: tag.CICLOVIDA || '',
            COR: tag.COR || '',
            DEPARTAMENTO: tag.DEPARTAMENTO || '',
            DESCRICAO: tag.DESCRICAO || '',
            EAN: tag.EAN || '',
            FAIXA: tag.FAIXA || '',
            SUBSEGMENTO: tag.SUBSEGMENTO || '',
            GRADE_QTD: tag.GRADE_QTD || '',
            COD_DCO: tag.COD_DCO || '',
            N_PEDIDO: tag.N_PEDIDO || '',
            QTD: tag.QTD || '',
        }))
    }

    private mapToCaeduVolumeFormat(tags: any[]): CaeduVolumeData[] {
        return tags.map(tag => ({
            CENTRO_FATURAMENTO: tag.CENTRO_FATURAMENTO || '',
            CICLOVIDA: tag.CICLOVIDA || '',
            COD_DCO: tag.COD_DCO || '',
            CODIGO_MATERIAL_SKU: tag.CODIGO_MATERIAL_SKU || '',
            COR: tag.COR || '',
            DEPARTAMENTO: tag.DEPARTAMENTO || '',
            DESCRICAO: tag.DESCRICAO || '',
            FAIXA: tag.FAIXA || '',
            FORNECEDOR: tag.FORNECEDOR || '',
            GRADE_QTD: tag.GRADE_QTD || '',
            GRADE: tag.GRADE || '',
            ITEM: tag.ITEM || '',
            N_PEDIDO: tag.N_PEDIDO || '',
            N_TAMANHO: tag.N_TAMANHO || '',
            PRECO_VDA: tag.PRECO_VDA || '',
            QTD: tag.QTD || '',
            SUBSEGMENTO: tag.SUBSEGMENTO || '',
            UC: tag.UC || '',
            VOLUME: tag.VOLUME || '',
        }))
    }

    private mapToCaeduPriceFormat(tags: any[]): CaeduPriceData[] {
        return tags.map(tag => ({
            N_PEDIDO: tag.N_PEDIDO || '',
            CENTRO_FATURAMENTO: tag.CENTRO_FATURAMENTO || '',
            CICLOVIDA: tag.CICLOVIDA || '',
            COD_DCO: tag.COD_DCO || '',
            CODIGO_MATERIAL_SKU: tag.CODIGO_MATERIAL_SKU || '',
            COR: tag.COR || '',
            DEPARTAMENTO: tag.DEPARTAMENTO || '',
            DESCRICAO: tag.DESCRICAO || '',
            FAIXA: tag.FAIXA || '',
            FORNECEDOR: tag.FORNECEDOR || '',
            GRADE: tag.GRADE || '',
            ITEM: tag.ITEM || '',
            N_TAMANHO: tag.N_TAMANHO || '',
            PRECO_VDA: tag.PRECO_VDA || '',
            GRADE_QTD: tag.GRADE_QTD || '',
            QTD: tag.QTD || '',
            SUBSEGMENTO: tag.SUBSEGMENTO || '',
            UC: tag.UC || '',
            tipoEtiqueta: tag.TipoEtiqueta || '',
        }))
    }

    private mapToCeAPriceFormat(tags: any[]): CeAPriceData[] {
        return tags.map(tag => ({
            N_PEDIDO: tag.N_PEDIDO || '',
            CODIGO_MASTER: tag.CODIGO_MASTER || '',
            CODIGO_DIGITO: tag.CODIGO_DIGITO || '',
            UC: tag.UC || '',
            GRADE: tag.GRADE || '',
            GRADE_QTD: tag.GRADE_QTD || '',
            VOLUME: tag.VOLUME || '',
            ANO: tag.ANO || '',
            CICLOVIDA: tag.CICLOVIDA || '',
            SUBSEGMENTO: tag.SUBSEGMENTO || '',
            N_TAMANHO: tag.N_TAMANHO || '',
            SEMANA: tag.SEMANA || '',
            DESCRICAO: tag.DESCRICAO || '',
            FAIXA: tag.FAIXA || '',
            ITEM: tag.ITEM || '',
            PRECO_VDA: tag.PRECO_VDA || '',
            DES_AUXILIAR_1: tag.DES_AUXILIAR_1 || '',
            DES_AUXILIAR_2: tag.DES_AUXILIAR_2 || '',
            EAN: tag.EAN || '',
            TOTAL: tag.TOTAL || '',
            QTD: tag.QTD || '',
        }))
    }

    private mapToCeAPackFormat(tags: any[]): CeAPackData[] {
        return tags.map(tag => ({
            N_PEDIDO: tag.N_PEDIDO || '',
            ITEM: tag.ITEM || '',
            CICLOVIDA: tag.CICLOVIDA || '',
            CODIGO_DIGITO: tag.CODIGO_DIGITO || '',
            CENTRO_FATURAMENTO: tag.CENTRO_FATURAMENTO || '',
            DES_AUXILIAR_1: tag.DES_AUXILIAR_1 || '',
            DES_AUXILIAR_2: tag.DES_AUXILIAR_2 || '',
            DESCRICAO: tag.DESCRICAO || '',
            QTD: tag.QTD || '',
            SUBSEGMENTO: tag.SUBSEGMENTO || '',
            CODIGO_MASTER: tag.CODIGO_MASTER || '',
        }))
    }
}
