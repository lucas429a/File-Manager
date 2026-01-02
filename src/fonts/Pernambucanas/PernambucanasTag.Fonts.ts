import fs from 'fs'
import { FontData } from '../calcenter/CalcenterCorrugado.Fonts'

export class PernambucanasTagFonts {
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
                data: fs.readFileSync('src/fonts/files/swiss-721-bold-bt.ttf'),
            },
            swiss_Black: {
                data: fs.readFileSync('src/fonts/files/swiss-721-bt-black-condensed.ttf'),
            },
            swiss: {
                data: fs.readFileSync('src/fonts/files/swiss.ttf'),
            },
            Oswald_SemiBold: {
                data: fs.readFileSync('src/fonts/files/Oswald-SemiBold.ttf'),
            },
            Oswald: {
                data: fs.readFileSync('src/fonts/files/Oswald-Regular.ttf'),
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
