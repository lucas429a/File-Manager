import fs from 'fs'
import { FontData } from '../calcenter/CalcenterCorrugado.Fonts'

export class DiSantinniPriceFonts {
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
            Roboto: {
                data: fs.readFileSync('src/fonts/files/Roboto-Regular.ttf'),
            },
            Roboto_Bold: {
                data: fs.readFileSync('src/fonts/files/Roboto-Bold.ttf'),
            },
            Roboto_Medium: {
                data: fs.readFileSync('src/fonts/files/Roboto-Medium.ttf'),
            },
            Arial: {
                data: fs.readFileSync('src/fonts/files/Arial-Regular.ttf'),
            },
            Arial_Medium: {
                data: fs.readFileSync('src/fonts/files/Arial-Medium.ttf'),
            },
            Arial_Bold: {
                data: fs.readFileSync('src/fonts/files/Arial-Bold.ttf'),
            },
            Arial_Narrow: {
                data: fs.readFileSync('src/fonts/files/Arial-Narrow-Regula.ttf'),
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
