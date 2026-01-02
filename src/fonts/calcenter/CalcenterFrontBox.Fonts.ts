import fs from 'fs'
import { FontData } from '../calcenter/CalcenterCorrugado.Fonts'

export class CalcenterFrontBoxFonts {
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
            Roboto_Light: {
                data: fs.readFileSync('src/fonts/files/Roboto_Condensed-Light.ttf'),
            },
            Roboto_Medium: {
                data: fs.readFileSync('src/fonts/files/Roboto-Medium.ttf'),
            },
            Calibri: {
                data: fs.readFileSync('src/fonts/files/calibri-regular.ttf'),
            },
            Calibri_Bold: {
                data: fs.readFileSync('src/fonts/files/calibri-bold.ttf'),
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
