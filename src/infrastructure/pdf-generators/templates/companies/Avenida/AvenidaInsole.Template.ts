import { Template } from '@pdfme/common'

export class AvenidaInsoleTemplate {
    private template: Template

    constructor() {
        this.template = {
            schemas: [
                [
                    {
                        name: 'BARCODE',
                        type: 'code128',
                        content: 'This is Code 128!',
                        position: { x: 3, y: 0.5 },
                        backgroundColor: '#ffffff',
                        barColor: '#000000',
                        textColor: '#000000',
                        includetext: true,
                        width: 42,
                        height: 16.93,
                        rotate: 0,
                        opacity: 1,
                        required: false,
                        readOnly: false,
                    },
                    {
                        name: 'BARCODE2',
                        type: 'code128',
                        content: 'This is Code 128!',
                        position: { x: 50, y: 0.5 },
                        backgroundColor: '#ffffff',
                        barColor: '#000000',
                        textColor: '#000000',
                        includetext: true,
                        width: 42,
                        height: 16.93,
                        rotate: 0,
                        opacity: 1,
                        required: false,
                        readOnly: false,
                    },
                ],
            ],
            basePdf:
                'data:application/pdf;base64,JVBERi0xLjMKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgaHR0cDovL3d3dy5yZXBvcnRsYWIuY29tCjEgMCBvYmoKPDwKL0YxIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMSAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL0NvbnRlbnRzIDcgMCBSIC9NZWRpYUJveCBbIDAgMCAyNjkuMjkxNyA1Ni42OTMgXSAvUGFyZW50IDYgMCBSIC9SZXNvdXJjZXMgPDwKL0ZvbnQgMSAwIFIgL1Byb2NTZXQgWyAvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJIF0KPj4gL1JvdGF0ZSAwIC9UcmFucyA8PAoKPj4gCiAgL1R5cGUgL1BhZ2UKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1BhZ2VNb2RlIC9Vc2VOb25lIC9QYWdlcyA2IDAgUiAvVHlwZSAvQ2F0YWxvZwo+PgplbmRvYmoKNSAwIG9iago8PAovQXV0aG9yIChhbm9ueW1vdXMpIC9DcmVhdGlvbkRhdGUgKEQ6MjAyNTEwMjMxMjIyNTMrMDAnMDAnKSAvQ3JlYXRvciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gd3d3LnJlcG9ydGxhYi5jb20pIC9LZXl3b3JkcyAoKSAvTW9kRGF0ZSAoRDoyMDI1MTAyMzEyMjI1MyswMCcwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gd3d3LnJlcG9ydGxhYi5jb20pIAogIC9TdWJqZWN0ICh1bnNwZWNpZmllZCkgL1RpdGxlICh1bnRpdGxlZCkgL1RyYXBwZWQgL0ZhbHNlCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9Db3VudCAxIC9LaWRzIFsgMyAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggNTkKPj4Kc3RyZWFtCkdhcFFoMEU9RiwwVVxIM1RccE5ZVF5RS2s/dGM+SVAsO1cjVTFeMjNpaFBFTV9QUCRPITNeLEM1UX4+ZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwNzMgMDAwMDAgbiAKMDAwMDAwMDEwNCAwMDAwMCBuIAowMDAwMDAwMjExIDAwMDAwIG4gCjAwMDAwMDA0MTIgMDAwMDAgbiAKMDAwMDAwMDQ4MCAwMDAwMCBuIAowMDAwMDAwNzc2IDAwMDAwIG4gCjAwMDAwMDA4MzUgMDAwMDAgbiAKdHJhaWxlcgo8PAovSUQgCls8ODU3YzRlNDMwMzg2OWI2ZWI0OTY3MmJkOTU5ZDgwZjI+PDg1N2M0ZTQzMDM4NjliNmViNDk2NzJiZDk1OWQ4MGYyPl0KJSBSZXBvcnRMYWIgZ2VuZXJhdGVkIFBERiBkb2N1bWVudCAtLSBkaWdlc3QgKGh0dHA6Ly93d3cucmVwb3J0bGFiLmNvbSkKCi9JbmZvIDUgMCBSCi9Sb290IDQgMCBSCi9TaXplIDgKPj4Kc3RhcnR4cmVmCjk4MwolJUVPRgo=',
            pdfmeVersion: '5.3.18',
        }
    }

    public getTemplate(): Template {
        return this.template
    }
}
