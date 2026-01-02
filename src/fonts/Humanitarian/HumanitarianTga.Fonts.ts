import fs from 'fs'
import { FontData } from '../calcenter/CalcenterCorrugado.Fonts'

export class HumanitarianTagFonts {
    private fonts: Record<string, FontData> = {}

    constructor() {
        this.loadFonts()
    }

    private loadFonts(): void {
        this.fonts = {
            Barlow: {
                data: fs.readFileSync('src/fonts/files/BarlowCondensed-Regular.ttf'),
                fallback: true,
            },
            DIN: {
                data: fs.readFileSync('src/fonts/files/D-DINCondensed.otf'),
            },
            DIN_CONDENSED: {
                data: fs.readFileSync('src/fonts/files/D-DINCondensed-Bold.otf'),
            },
            DIN_BOLD: {
                data: fs.readFileSync('src/fonts/files/D-DIN-Bold.otf'),
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
