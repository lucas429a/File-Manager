export interface IFileProcessor {
    processFiles(files: Express.Multer.File[], companyCode: number, ciclovida?: string): Promise<any>
    organizeFiles(files: Express.Multer.File[]): Promise<any>
}

export abstract class FileProcessorBase implements IFileProcessor {
    abstract processFiles(files: Express.Multer.File[], companyCode: number, ciclovida?: string): Promise<any>
    abstract organizeFiles(files: Express.Multer.File[]): Promise<any>
}
