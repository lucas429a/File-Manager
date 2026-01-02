export interface IConverter<TInput = any, TOutput = any> {
    convert(input: TInput): TOutput | Promise<TOutput>
}

export interface IFileConverter<TOutput = any> {
    convertFile(filePath: string): TOutput[] | Promise<TOutput[]>
    convertContent(content: string): TOutput[] | Promise<TOutput[]>
}

export abstract class ConverterBase<TInput = any, TOutput = any> implements IConverter<TInput, TOutput> {
    abstract convert(input: TInput): TOutput | Promise<TOutput>
}
