import fs from 'fs'
import { FontData } from '../calcenter/CalcenterCorrugado.Fonts'

export class TorraTagFonts {
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
            Swiss: {
                data: fs.readFileSync('src/fonts/files/swiss.ttf'),
            },
            swiss_bold_condensed: {
                data: fs.readFileSync('src/fonts/files/swiss-721-bt-bold-condensed.ttf'),
            },
            Roboto_Black: {
                data: fs.readFileSync('src/fonts/files/Roboto-Black.ttf'),
            },
            Oswald_SemiBold: {
                data: fs.readFileSync('src/fonts/files/Oswald-SemiBold.ttf'),
            },
            Oswald: {
                data: fs.readFileSync('src/fonts/files/Oswald-Regular.ttf'),
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
