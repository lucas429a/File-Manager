import { Company } from '../entities/Company'

export interface CompanyConfiguration {
    companyId: number
    tagTypes: string[]
    requiredFileCount: number
    supportedFormats: string[]
}

export class CompanyRulesService {
    private static readonly companyConfigurations: Record<number, CompanyConfiguration> = {
        1758846: {
            companyId: 1758846,
            tagTypes: ['corrugado', 'frontbox', 'palmilha', 'calcentertag'],
            requiredFileCount: 3,
            supportedFormats: ['csv'],
        },
        1742590: {
            companyId: 1742590,
            tagTypes: ['price', 'volume', 'sku'],
            requiredFileCount: 2,
            supportedFormats: ['csv'],
        },
        1756059: {
            companyId: 1756059,
            tagTypes: ['pricebesni'],
            requiredFileCount: 1,
            supportedFormats: ['xml'],
        },
        1757040: {
            companyId: 1757040,
            tagTypes: ['pricedigaspi'],
            requiredFileCount: 1,
            supportedFormats: ['csv'],
        },
        1742619: {
            companyId: 1742619,
            tagTypes: ['pack', 'skuprice', 'pricedisantinni'],
            requiredFileCount: 2,
            supportedFormats: ['csv'],
        },
        1760014: {
            companyId: 1760014,
            tagTypes: ['avenidaprice', 'avenidapack', 'avenidainsole'],
            requiredFileCount: 1,
            supportedFormats: ['zpl'],
        },
        1758860: {
            companyId: 1758860,
            tagTypes: ['torratag'],
            requiredFileCount: 1,
            supportedFormats: ['csv'],
        },
        1760026: {
            companyId: 1760026,
            tagTypes: ['humanitarian'],
            requiredFileCount: 3,
            supportedFormats: ['txt'],
        },
        1758780: {
            companyId: 1758780,
            tagTypes: ['pernambucanastag'],
            requiredFileCount: 1,
            supportedFormats: ['csv'],
        },
        3132717: {
            companyId: 3132717,
            tagTypes: ['lfprice', 'lfvolume'],
            requiredFileCount: 2,
            supportedFormats: ['zpl'],
        },
        1756084: {
            companyId: 1756084,
            tagTypes: ['caeduvolume', 'caeduprice', 'caedunoprice'],
            requiredFileCount: 1,
            supportedFormats: ['csv'],
        },
        1758779: {
            companyId: 1758779,
            tagTypes: ['ceaprice', 'ceapack'],
            requiredFileCount: 1,
            supportedFormats: ['csv'],
        },
    }

    public getCompanyConfiguration(companyId: number): CompanyConfiguration | null {
        return CompanyRulesService.companyConfigurations[companyId] || null
    }

    public validateFileCount(companyId: number, fileCount: number): { isValid: boolean; message?: string } {
        const config = this.getCompanyConfiguration(companyId)

        if (!config) {
            return { isValid: false, message: `Company not configured: ${companyId}` }
        }

        if (companyId === 1742590) {
            if (fileCount < 2 || fileCount > 3) {
                return {
                    isValid: false,
                    message: `2-3 files are required for Riachuelo`,
                }
            }
            return { isValid: true }
        }

        if (companyId === 3132717) {
            if (fileCount < 1 || fileCount > 2) {
                return {
                    isValid: false,
                    message: `1-2 files are required for LinsFerrao`,
                }
            }
            return { isValid: true }
        }

        if (fileCount !== config.requiredFileCount) {
            return {
                isValid: false,
                message: `There are ${config.requiredFileCount} file(s) required for this company`,
            }
        }

        return { isValid: true }
    }

    public getTagTypesForCompany(companyId: number): string[] {
        const config = this.getCompanyConfiguration(companyId)
        return config?.tagTypes || []
    }

    public getSupportedFormats(companyId: number): string[] {
        const config = this.getCompanyConfiguration(companyId)
        return config?.supportedFormats || []
    }

    public isCompanySupported(companyId: number): boolean {
        return !!this.getCompanyConfiguration(companyId)
    }

    public getAllSupportedCompanies(): number[] {
        return Object.keys(CompanyRulesService.companyConfigurations).map(Number)
    }
}
