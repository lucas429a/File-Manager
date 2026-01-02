import fs from 'fs'
import { FontData } from '../calcenter/CalcenterCorrugado.Fonts'

export class CeAFonts {
    private fonts: Record<string, FontData> = {}

    constructor() {
        this.loadFonts()
    }

    private loadFonts(): void {
        this.fonts = {
            Helvetica: {
                data: fs.readFileSync('src/fonts/files/Helvetica.ttf'),
                fallback: true,
            },
            Helvetica_Bold: {
                data: fs.readFileSync('src/fonts/files/Helvetica-Bold.ttf'),
            },
            Helvetica_Condensed: {
                data: fs.readFileSync('src/fonts/files/Helvetica-condensed.ttf'),
            },
            Helvetica_Condensed_Bold: {
                data: fs.readFileSync('src/fonts/files/Helvetica-condensed-bold.ttf'),
            },
            Helvetica_Condensed_Medium: {
                data: fs.readFileSync('src/fonts/files/helvetica-condensed-medium-1.otf'),
            },
            Retro: {
                data: fs.readFileSync('src/fonts/files/Retro-Gaming.ttf'),
            },
            ocrb: {
                data: fs.readFileSync('src/fonts/files/OCR-B.ttf'),
            },
            VCR: {
                data: fs.readFileSync('src/fonts/files/VCR.ttf'),
            },
            MM_Condensed_EL: {
                data: fs.readFileSync('src/fonts/files/MartianMono_Condensed-ExtraLight.ttf'),
            },
            MM_Condensed_L: {
                data: fs.readFileSync('src/fonts/files/MartianMono_Condensed-Light.ttf'),
            },
        }
    }

    public getFont(name: string): FontData | undefined {
        return this.fonts[name]
    }

    public getAllFonts(): Record<string, FontData> {
        return this.fonts
    }
}
