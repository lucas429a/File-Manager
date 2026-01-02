import fs from 'fs'
import { FontData } from '../calcenter/CalcenterCorrugado.Fonts'

export class RiachueloSKUFonts {
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
        }
    }

    public getFont(name: string): FontData {
        return this.fonts[name]
    }

    public getAllFonts(): Record<string, FontData> {
        return this.fonts
    }
}
