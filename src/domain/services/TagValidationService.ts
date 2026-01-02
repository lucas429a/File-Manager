import { Tag } from '../entities/Tag'

export class TagValidationService {
    public validateTag(tag: Tag): { isValid: boolean; errors: string[] } {
        const errors: string[] = []

        if (!tag.orderNumber) {
            errors.push('Order number is required')
        }

        if (!tag.companyId) {
            errors.push('Company ID is required')
        }

        if (!tag.tagType) {
            errors.push('Tag type is required')
        }

        return {
            isValid: errors.length === 0,
            errors,
        }
    }

    public validateTagData(data: Record<string, any>, tagType: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = []

        const requiredFields = this.getRequiredFieldsByTagType(tagType)

        for (const field of requiredFields) {
            if (!data[field]) {
                errors.push(`Field '${field}' is required for tag type ${tagType}`)
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        }
    }

    private getRequiredFieldsByTagType(tagType: string): string[] {
        const normalizedType = tagType.toLowerCase()

        if (normalizedType.includes('price')) {
            return ['description', 'price']
        }

        if (normalizedType.includes('volume')) {
            return ['description', 'volume']
        }

        if (normalizedType.includes('pack')) {
            return ['description']
        }

        return ['description']
    }
}
