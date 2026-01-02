import fs from 'fs'
import { FontData } from '../calcenter/CalcenterCorrugado.Fonts'

export class DiSantinniPackFonts {
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
        }
    }

    public getFont(name: string): FontData | undefined {
        return this.fonts[name]
    }

    public getAllFonts(): Record<string, FontData> {
        return this.fonts
    }
}
