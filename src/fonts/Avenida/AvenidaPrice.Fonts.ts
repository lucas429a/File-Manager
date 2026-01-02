import fs from 'fs'
import { FontData } from '../calcenter/CalcenterCorrugado.Fonts'

export class AvenidaPriceFonts {
    private fonts: Record<string, FontData> = {}

    constructor() {
        this.loadFonts()
    }

    private loadFonts(): void {
        this.fonts = {
            Roboto: {
                data: fs.readFileSync('src/fonts/files/Roboto-Regular.ttf'),
                fallback: true,
            },
            Roboto_Bold: {
                data: fs.readFileSync('src/fonts/files/Roboto-Bold.ttf'),
            },
            Arial_Narrow: {
                data: fs.readFileSync('src/fonts/files/Arial-Narrow.ttf'),
            },
            Arial_Condensed_Bold: {
                data: fs.readFileSync('src/fonts/files/Arial-Condensed-Bold-Regular.ttf'),
            },
            OCRA: {
                data: fs.readFileSync('src/fonts/files/OCR-ARegular.otf'),
            },
            Barlow: {
                data: fs.readFileSync('src/fonts/files/BarlowCondensed-Regular.ttf'),
            },
            Arial_Condensed: {
                data: fs.readFileSync('src/fonts/files/Arial-Condensed-Bold-Regular.ttf'),
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
