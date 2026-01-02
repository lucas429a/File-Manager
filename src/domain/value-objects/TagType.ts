export enum TagType {
    PRICE = 'price',
    VOLUME = 'volume',
    SKU = 'sku',
    PACK = 'pack',
    INSOLE = 'insole',
    CORRUGATED = 'corrugado',
    FRONTBOX = 'frontbox',
    TAG = 'tag',

    // Calcenter
    CALCENTER_CORRUGADO = 'corrugado',
    CALCENTER_FRONTBOX = 'frontbox',
    CALCENTER_PALMILHA = 'palmilha',
    CALCENTER_TAG = 'calcentertag',

    // Riachuelo
    RIACHUELO_PRICE = 'price',
    RIACHUELO_VOLUME = 'volume',
    RIACHUELO_SKU = 'sku',

    // Besni
    BESNI_PRICE = 'pricebesni',

    // DiGaspi
    DIGASPI_PRICE = 'pricedigaspi',

    // DiSantinni
    DISANTINNI_PACK = 'pack',
    DISANTINNI_SKU = 'skuprice',
    DISANTINNI_PRICE = 'pricedisantinni',

    // Avenida
    AVENIDA_PRICE = 'avenidaprice',
    AVENIDA_PACK = 'avenidapack',
    AVENIDA_INSOLE = 'avenidainsole',

    // Torra
    TORRA_TAG = 'torratag',

    // Humanitarian
    HUMANITARIAN = 'humanitarian',

    // Pernambucanas
    PERNAMBUCANAS_TAG = 'pernambucanastag',

    // Lins Ferrão
    LF_PRICE = 'lfprice',
    LF_VOLUME = 'lfvolume',

    // Caedu
    CAEDU_VOLUME = 'caeduvolume',
    CAEDU_PRICE = 'caeduprice',
    CAEDU_NOPRICE = 'caedunoprice',

    // CeA
    CEA_PRICE = 'ceaprice',
    CEA_PACK = 'ceapack',
}

export class TagTypeValue {
    private readonly value: string

    private constructor(value: string) {
        this.value = value.toLowerCase().trim()
    }

    public static create(value: string): TagTypeValue {
        if (!value) {
            throw new Error('Tipo de etiqueta é obrigatório')
        }

        return new TagTypeValue(value)
    }

    public getValue(): string {
        return this.value
    }

    public equals(other: TagTypeValue): boolean {
        return this.value === other.getValue()
    }

    public toString(): string {
        return this.value
    }

    public isPrice(): boolean {
        return this.value.includes('price')
    }

    public isVolume(): boolean {
        return this.value.includes('volume')
    }

    public isPack(): boolean {
        return this.value.includes('pack')
    }

    public isInsole(): boolean {
        return this.value.includes('insole') || this.value.includes('palmilha')
    }
}
