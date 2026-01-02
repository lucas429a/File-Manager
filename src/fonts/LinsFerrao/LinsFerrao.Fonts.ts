import fs from 'fs'
import { FontData } from '../calcenter/CalcenterCorrugado.Fonts'

export class LinsFerraoPriceFonts {
    private fonts: Record<string, FontData> = {}

    constructor() {
        this.loadFonts()
    }

    private loadFonts(): void {
        this.fonts = {
            Roboto_Condensed_Bold: {
                data: fs.readFileSync('src/fonts/files/Roboto_Condensed-Bold.ttf'),
                fallback: true,
            },
            Helvetica_Bold: {
                data: fs.readFileSync('src/fonts/files/Helvetica-Bold.ttf'),
            },
            Arial_Narrow: {
                data: fs.readFileSync('src/fonts/files/Arial-Narrow.ttf'),
            },
            Arial_Bold: {
                data: fs.readFileSync('src/fonts/files/Arial-Bold.ttf'),
            },
            Arial_Condensed_Bold: {
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
