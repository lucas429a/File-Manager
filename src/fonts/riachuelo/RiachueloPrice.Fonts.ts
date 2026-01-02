import fs from 'fs'
import { FontData } from '../calcenter/CalcenterCorrugado.Fonts'

export class RiachueloPriceFonts {
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
            swiss_Bold: {
                data: fs.readFileSync('src/fonts/files/swiss-721-bt-bold-condensed.ttf'),
            },
            swiss: {
                data: fs.readFileSync('src/fonts/files/swiss.ttf'),
            },
            Helvetica_Compressed: {
                data: fs.readFileSync('src/fonts/files/Helvetica-compressed.ttf'),
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
