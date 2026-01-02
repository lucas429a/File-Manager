export abstract class FileProcessorBase {
    abstract processFiles(files: Express.Multer.File[], companyCode: number, ciclovida?: string): Promise<any>
    abstract organizeFiles(files: Express.Multer.File[]): Promise<any>
}
