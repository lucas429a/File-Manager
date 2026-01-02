import { AvenidaTagConverter } from '../converters/companies/Avenida/AvenidaTagConverter'
import { BesniPriceConverter } from '../converters/companies/Besni/BesniPriceConverter'
import { CaeduPriceConverter } from '../converters/companies/Caedu/CaeduPriceConverter'
import { CaeduVolumeConverter } from '../converters/companies/Caedu/CaeduVolumeConverter'
import { CalcenterCorrugadoConverter } from '../converters/companies/Calcenter/CorrugatedConverter'
import { CalcenterFrontBoxConverter } from '../converters/companies/Calcenter/FrontBoxConverter'
import { CalcenterInsoleConverter } from '../converters/companies/Calcenter/InsoleConverter'
import { CeAPackConverter } from '../converters/companies/CeA/CeAPackConverter'
import { CeAPriceConverter } from '../converters/companies/CeA/CeAPriceConverter'
import { DiGaspiTagConverter } from '../converters/companies/DiGaspi/DiGaspiTagConverter'
import { DiSantiniPackConverter } from '../converters/companies/DiSantini/DiSantiniPackConverter'
import { DiSantiniPriceSKUConverter } from '../converters/companies/DiSantini/DiSantiniPriceSkuConverter'
import { HumanitarianConverter } from '../converters/companies/Humanitarian/HumanitarianConverter'
import { LinsFerraoPriceConverter } from '../converters/companies/LinsFerrao/LinsFerraoPriceConverter'
import { LinsFerraoVolumeConverter } from '../converters/companies/LinsFerrao/LinsFerraoVolume'
import { PernambucanasTagConverter } from '../converters/companies/Pernambucanas/PernambucanasTagConverter'
import { RiachueloPriceTagConverter } from '../converters/companies/Riachuelo/RiachueloPriceTagConverter'
import { RiachueloSKUTagConverter } from '../converters/companies/Riachuelo/RiachueloSKUTagConverter'
import { RiachueloVolumeTagConverter } from '../converters/companies/Riachuelo/RiachueloVolumeTagConverter'
import { TorraTagConverter } from '../converters/companies/Torra/TorraTagConverter'

export interface ConverterType {
    typeTag: string
    codeCompany: number
    fileType?: 'csv' | 'xml' | 'zpl'
}

export type ConverterContructor = new (config?: { fileType?: 'csv' | 'xml' | 'zpl' }) => any

export class ConverterFactory {
    static calcenterCode = 1758846
    static riachueloCode = 1742590
    static besniCode = 1756059
    static diGaspiCode = 1757040
    static diSantiniCode = 1742619
    static avenidaCode = 1760014
    static torraCode = 1758860
    static humanitarianCode = 1760026
    static pernambucanasCode = 1758780
    static linsFerraoCode = 3132717
    static caeduCode = 1756084
    static ceaCode = 1758779

    private static converters: Record<number, Record<string, ConverterContructor>> = {
        1758846: {
            corrugado: CalcenterCorrugadoConverter,
            frontbox: CalcenterFrontBoxConverter,
            palmilha: CalcenterInsoleConverter,
        },
        1742590: {
            price: RiachueloPriceTagConverter,
            sku: RiachueloSKUTagConverter,
            volume: RiachueloVolumeTagConverter,
        },
        1756059: {
            pricebesni: BesniPriceConverter,
        },
        1757040: {
            pricedigaspi: DiGaspiTagConverter,
        },
        1742619: {
            skuprice: DiSantiniPriceSKUConverter,
            pack: DiSantiniPackConverter,
        },
        1760014: {
            avenidaprice: AvenidaTagConverter,
            avenidapack: AvenidaTagConverter,
            avenidainsole: AvenidaTagConverter,
        },
        1758860: {
            torratag: TorraTagConverter,
        },
        1760026: {
            humanitarianTag: HumanitarianConverter,
        },
        1758780: {
            pernambucanastag: PernambucanasTagConverter,
        },
        3132717: {
            lfprice: LinsFerraoPriceConverter,
            lfvolume: LinsFerraoVolumeConverter,
        },
        1756084: {
            caeduprice: CaeduPriceConverter,
            caeduvolume: CaeduVolumeConverter,
        },
        1758779: {
            ceaprice: CeAPriceConverter,
            ceapack: CeAPackConverter,
        },
    }

    static getConverter({ typeTag, codeCompany }: ConverterType) {
        const companyConverter = this.converters[codeCompany]

        if (!companyConverter) {
            throw new Error(`Converter not found for this company:${codeCompany}`)
        }

        const ConverterClass = companyConverter[typeTag]
        if (!ConverterClass) {
            throw new Error(`Converter not found for tag type:${typeTag}`)
        }

        return new ConverterClass()
    }
}
