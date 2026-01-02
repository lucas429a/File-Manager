import { BesniPriceData } from '../converters/companies/Besni/BesniPriceConverter'
import { CSVData } from '../converters/companies/Calcenter/CorrugatedConverter'
import { CSVDataFrontBox } from '../converters/companies/Calcenter/FrontBoxConverter'
import { CSVDataInsole } from '../converters/companies/Calcenter/InsoleConverter'
import { DiGaspiTagData } from '../converters/companies/DiGaspi/DiGaspiTagConverter'
import { DiSantinniPackData } from '../converters/companies/DiSantini/DiSantiniPackConverter'
import { DiSantiniPriceSkuData } from '../converters/companies/DiSantini/DiSantiniPriceSkuConverter'
import { RiachueloTagPriceData } from '../converters/companies/Riachuelo/RiachueloPriceTagConverter'
import { RiachueloSKUTagData } from '../converters/companies/Riachuelo/RiachueloSKUTagConverter'
import { RiachueloVolumeTagData } from '../converters/companies/Riachuelo/RiachueloVolumeTagConverter'
import { BesniPricePDF } from '../pdf-generators/companies/Besni/BesniPricePDF'
import { CalcenterCorrugadoPDF } from '../pdf-generators/companies/Calcenter/CalcenterCorrugatedPDF'
import { CalcenterFrontBoxPDF } from '../pdf-generators/companies/Calcenter/CalcenterFrontBoxPDF'
import { CalcenterInsolePDF } from '../pdf-generators/companies/Calcenter/CalcenterInsolePDF'
import { DiGaspiPricePDF } from '../pdf-generators/companies/DiGaspi/DiGaspiPricePDF'
import { DiSantinniSKUPDF } from '../pdf-generators/companies/DiSantinni/DiSantinniSkuPDF'
import { DiSantinniPackPDF } from '../pdf-generators/companies/DiSantinni/DiSantinniPackPDF'
import { RiachueloPricePDF } from '../pdf-generators/companies/Riachuelo/RiachueloPricePDF'
import { RiachueloSKUPDF } from '../pdf-generators/companies/Riachuelo/RiachueloSKUPDF'
import { RiachueloVolumePDF } from '../pdf-generators/companies/Riachuelo/RiachueloVolumePDF'
import { DiSantinniPricePDF } from '../pdf-generators/companies/DiSantinni/DiSantinniPricePDF'
import { CalcenterTagData, CalcenterTagPDF } from '../pdf-generators/companies/Calcenter/CalcenterTagPDF'
import { AvenidaTagData } from '../converters/companies/Avenida/AvenidaTagConverter'
import { AvenidaPricePDF } from '../pdf-generators/companies/Avenida/AvenidaPricePDF'
import { AvenidaPackPDF } from '../pdf-generators/companies/Avenida/AvenidaPackPDF'
import { AvenidaInsolePDF } from '../pdf-generators/companies/Avenida/AvenidaInsolePDF'
import { TorraTagData } from '../converters/companies/Torra/TorraTagConverter'
import { TorraTagPDF } from '../pdf-generators/companies/Torra/TorraTagPDF'
import { HumanitarianTagData } from '../converters/companies/Humanitarian/HumanitarianConverter'
import { HumanitarianTagPDF } from '../pdf-generators/companies/Humanitarian/HumanitarianTagPDF'
import { PernambucanasTagData } from '../converters/companies/Pernambucanas/PernambucanasTagConverter'
import { PernambucanasTagPDF } from '../pdf-generators/companies/Pernambucanas/PernambucanasTagPDF'
import { LinsFerraoPriceData } from '../converters/companies/LinsFerrao/LinsFerraoPriceConverter'
import { LinsFerraoPricePDF } from '../pdf-generators/companies/LinsFerrao/LinsFerraoPricePDF'
import { LinsFerraoVolumeData } from '../converters/companies/LinsFerrao/LinsFerraoVolume'
import { LinsFerraoVolumePDF } from '../pdf-generators/companies/LinsFerrao/LinsFerraoVolumePDF'
import { CaeduVolumeData } from '../converters/companies/Caedu/CaeduVolumeConverter'
import { CaeduVolumePDF } from '../pdf-generators/companies/Caedu/CaeduVolumePDF'
import { CaeduPriceData } from '../converters/companies/Caedu/CaeduPriceConverter'
import { CaeduPricePDF } from '../pdf-generators/companies/Caedu/CaeduPricePDF'
import { CeAPriceData } from '../converters/companies/CeA/CeAPriceConverter'
import { CeAPricePDF } from '../pdf-generators/companies/CeA/CeAPricePDF'
import { CeAPackData } from '../converters/companies/CeA/CeAPackConverter'
import { CeAPackPDF } from '../pdf-generators/companies/CeA/CeAPackPDF'

export interface IPDFGenerator {
    generate(
        outputFileName: string,
        data:
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
            | CeAPackData[],
        quantity?: number,
    ): Promise<Buffer>
}

export class PDFGeneratorFactory {
    static calcenterCode = 1758846
    static riachueloCode = 1742590
    static besniCode = 1756059
    static diGaspiCode = 1757040
    static diSantiniCode = 1742619
    static avenidaCode = 1760014
    static torraCode = 1758860

    private static generators: Record<number, Record<string, new () => IPDFGenerator>> = {
        1758846: {
            corrugado: CalcenterCorrugadoPDF,
            frontbox: CalcenterFrontBoxPDF,
            palmilha: CalcenterInsolePDF,
            calcentertag: CalcenterTagPDF,
        },
        1742590: {
            price: RiachueloPricePDF,
            volume: RiachueloVolumePDF,
            sku: RiachueloSKUPDF,
        },
        1756059: {
            pricebesni: BesniPricePDF,
        },
        1757040: {
            pricedigaspi: DiGaspiPricePDF,
        },
        1742619: {
            pack: DiSantinniPackPDF,
            skuprice: DiSantinniSKUPDF,
            pricedisantinni: DiSantinniPricePDF,
        },
        1760014: {
            avenidaprice: AvenidaPricePDF,
            avenidapack: AvenidaPackPDF,
            avenidainsole: AvenidaInsolePDF,
        },
        1758860: {
            torratag: TorraTagPDF,
        },
        1760026: {
            humanitarian: HumanitarianTagPDF,
        },
        1758780: {
            pernambucanastag: PernambucanasTagPDF,
        },
        3132717: {
            lfprice: LinsFerraoPricePDF,
            lfvolume: LinsFerraoVolumePDF,
        },
        1756084: {
            caeduvolume: CaeduVolumePDF,
            caeduprice: CaeduPricePDF,
            caedunoprice: CaeduPricePDF,
        },
        1758779: {
            ceaprice: CeAPricePDF,
            ceapack: CeAPackPDF,
        },
    }

    static getGenerator({ typeTag, codeCompany }: { typeTag: string; codeCompany: number }): IPDFGenerator {
        const companyGenerators = this.generators[codeCompany]

        if (!companyGenerators) {
            throw new Error(`Generator not found for this company: ${codeCompany}`)
        }

        const GeneratorClass = companyGenerators[typeTag.trim().toLowerCase()]
        if (!GeneratorClass) {
            throw new Error(`Generator not found for tag type: ${typeTag}`)
        }

        return new GeneratorClass()
    }
}
