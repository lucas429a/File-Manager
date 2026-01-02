import axios from 'axios'
import path from 'path'
import fs from 'node:fs'

let csvData: string

beforeAll(() => {
    const filePath = path.join(__dirname, '../docs/teste.txt')
    csvData = fs.readFileSync(filePath, 'utf-8')
})

test('Initial test from API', async () => {
    const output = await axios.post('http://localhost:3002/test', { csvData, keyWord: 'CORRUGADO' })

    console.log(output.data)
}, 20000)
