import { ConverterFactory } from './ConverterFactory'
import { FileProcessorBase } from '../file-processors/base/FileProcessorBase'
import { CalcenterFileProcessor } from '../file-processors/companies/CalcenterFileProcessor'
import { RiachueloFileProcessor } from '../file-processors/companies/RiachueloFileProcessor'
import { BesniFileProcessor } from '../file-processors/companies/BesniFileProcessor'
import { DiGaspiFileProcessor } from '../file-processors/companies/DiGaspiFileProcessor'
import { DiSantinniFileProcessor } from '../file-processors/companies/DiSantinniFileProcessor'
import { AvenidaFileProcessor } from '../file-processors/companies/AvenidaFileProcessor'
import { TorraFileProcessor } from '../file-processors/companies/TorraFileProcessor'
import { HumanitarianFileProcessor } from '../file-processors/companies/HumanitarianFileProcessor'
import { PernambucanasFileProcessor } from '../file-processors/companies/PernambucanasFileProcessor'
import { LinsFerraoFileProcessor } from '../file-processors/companies/LinsFerraoFileProcessor'
import { CaeduFileProcessor } from '../file-processors/companies/CaeduFileProcessor'
import { CeAFileProcessor } from '../file-processors/companies/CeAFileProcessor'

export { ConverterFactory }

export const CompanyCodes = {
    calcenter: ConverterFactory.calcenterCode,
    riachuelo: ConverterFactory.riachueloCode,
    besni: ConverterFactory.besniCode,
    diGaspi: ConverterFactory.diGaspiCode,
    diSantini: ConverterFactory.diSantiniCode,
    avenida: ConverterFactory.avenidaCode,
    torra: ConverterFactory.torraCode,
    humanitarian: ConverterFactory.humanitarianCode,
    pernambucanas: ConverterFactory.pernambucanasCode,
    linsFerrao: ConverterFactory.linsFerraoCode,
    caedu: ConverterFactory.caeduCode,
    cea: ConverterFactory.ceaCode
}

export class FileProcessorFactory {
    static getProcessor(companyCode: number): FileProcessorBase {
        switch (companyCode) {
            case ConverterFactory.calcenterCode:
                return new CalcenterFileProcessor()
            case ConverterFactory.riachueloCode:
                return new RiachueloFileProcessor()
            case ConverterFactory.besniCode:
                return new BesniFileProcessor()
            case ConverterFactory.diGaspiCode:
                return new DiGaspiFileProcessor()
            case ConverterFactory.diSantiniCode:
                return new DiSantinniFileProcessor()
            case ConverterFactory.avenidaCode:
                return new AvenidaFileProcessor()
            case ConverterFactory.torraCode:
                return new TorraFileProcessor()
            case ConverterFactory.humanitarianCode:
                return new HumanitarianFileProcessor()
            case ConverterFactory.pernambucanasCode:
                return new PernambucanasFileProcessor()
            case ConverterFactory.linsFerraoCode:
                return new LinsFerraoFileProcessor()
            case ConverterFactory.caeduCode:
                return new CaeduFileProcessor()
            case ConverterFactory.ceaCode:
                return new CeAFileProcessor()
            default:
                throw new Error('Code company not found: ' + companyCode)
        }
    }
}
