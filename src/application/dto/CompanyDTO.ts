export interface CompanyDTO {
    id: number
    name: string
    alias?: string | null
    tagTypes?: string[]
}

export interface CompanyListOutputDTO {
    companies: CompanyDTO[]
}

export interface CreateCompanyInputDTO {
    id: number
    name: string
    alias?: string
}

export interface CreateCompaniesInputDTO {
    companies: CreateCompanyInputDTO[]
}

export interface CreateCompaniesOutputDTO {
    created: CompanyDTO[]
    errors: Array<{
        company: CreateCompanyInputDTO
        error: string
    }>
}
