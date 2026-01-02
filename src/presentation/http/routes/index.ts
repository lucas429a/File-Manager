import { Application, Request, Response } from 'express'
import { tagRoutes } from './tag.routes' 
import { companyRoutes } from './company.routes' 
import { uploadRoutes } from './upload.routes' 
import { pdfRoutes } from './pdf.routes' 
import { downloadRoutes } from './download.routes' 

export function setupRoutes(app: Application): void {
    app.get('/', (req: Request, res: Response) => {
        res.json({
            success: true,
            message: 'Tag Integrator API - Portfolio Edition',
            version: '2.0.0',
            endpoints: {
                companies: '/api/companies',
                tags: '/api/tags',
                upload: '/api/upload',
                pdf: '/api/pdf',
                download: '/api/download',
            },
        })
    })

    app.get('/health', (req: Request, res: Response) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
        })
    })

    app.use('/api/companies', companyRoutes())
    app.use('/api/tags', tagRoutes())
    app.use('/api/upload', uploadRoutes())
    app.use('/api/pdf', pdfRoutes())
    app.use('/api/download', downloadRoutes())

    app.use('/list-companies', companyRoutes())
    app.use('/list-tags', tagRoutes())
    app.use('/tags-by-company', tagRoutes())
    app.use('/types-by-company', companyRoutes())
    app.use('/upload', uploadRoutes())
    app.use('/download-pdf', pdfRoutes())
    app.use('/delete-tags', tagRoutes())
}
