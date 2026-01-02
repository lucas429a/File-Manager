import fs from 'fs'
import { FontData } from '../calcenter/CalcenterCorrugado.Fonts'

export class CaeduFonts {
    private fonts: Record<string, FontData> = {}

    constructor() {
        this.loadFonts()
    }

    private loadFonts(): void {
        this.fonts = {
            Roboto: {
                data: fs.readFileSync('src/fonts/files/Roboto-Medium.ttf'),
                fallback: true,
            },
            Roboto_Bold: {
                data: fs.readFileSync('src/fonts/files/Roboto-Bold.ttf'),
            },
            Arial_Narrow: {
                data: fs.readFileSync('src/fonts/files/Arial-Narrow.ttf'),
            },
            Arial_Bold: {
                data: fs.readFileSync('src/fonts/files/Arial-Bold.ttf'),
            },
            tahoma: {
                data: fs.readFileSync('src/fonts/files/tahoma-bold.ttf'),
            },
            franklin_gothic: {
                data: fs.readFileSync('src/fonts/files/Franklin-Gothic-Bold.ttf'),
            },
            swiss_Black: {
                data: fs.readFileSync('src/fonts/files/swiss-721-black-bt.ttf'),
            },
            swiss_Black_Condensed: {
                data: fs.readFileSync('src/fonts/files/swiss-721-bt-black-condensed.ttf'),
            },
            swiss_Bold: {
                data: fs.readFileSync('src/fonts/files/swiss-721-bold-bt.ttf'),
            },
            swiss_Bold_Condensed: {
                data: fs.readFileSync('src/fonts/files/swiss-721-bt-bold-condensed.ttf'),
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
