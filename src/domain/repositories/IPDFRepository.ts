import { PDFDocument } from '../entities/PDFDocument'

export interface IPDFRepository {
    save(document: PDFDocument): Promise<PDFDocument>
    findById(id: string): Promise<PDFDocument | null>
    findByOrder(orderNumber: string, companyId: number): Promise<PDFDocument[]>
    saveToFile(document: PDFDocument, outputPath: string): Promise<string>
    delete(id: string): Promise<void>
}
