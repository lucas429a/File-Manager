const bwipjs = require('bwip-js')
const fs = require('fs')

async function testCode93() {
    console.log('=== TESTE DIRETO COM BWIP-JS ===\n')

    const testValue = 'A311601515000010'

    // Teste 1: Configuração padrão
    console.log('Teste 1: Configuração padrão (como EAN13, Code128, etc)')
    try {
        const png1 = await bwipjs.toBuffer({
            bcid: 'code93',
            text: testValue,
            scale: 5,
            width: 45,
            height: 8,
            includetext: false,
            includecheck: true,
        })
        fs.writeFileSync('code93-test1-padrao.png', png1)
        console.log('✅ Gerado: code93-test1-padrao.png (width/height fixos)\n')
    } catch (e) {
        console.log('❌ Erro:', e.message, '\n')
    }

    // Teste 2: Sem width/height
    console.log('Teste 2: Sem width/height (só scale)')
    try {
        const png2 = await bwipjs.toBuffer({
            bcid: 'code93',
            text: testValue,
            scale: 3,
            includetext: false,
            includecheck: true,
        })
        fs.writeFileSync('code93-test2-scale-only.png', png2)
        console.log('✅ Gerado: code93-test2-scale-only.png (scale 3)\n')
    } catch (e) {
        console.log('❌ Erro:', e.message, '\n')
    }

    // Teste 3: Scale maior sem dimensões
    console.log('Teste 3: Scale maior sem dimensões')
    try {
        const png3 = await bwipjs.toBuffer({
            bcid: 'code93',
            text: testValue,
            scale: 5,
            includetext: false,
            includecheck: true,
        })
        fs.writeFileSync('code93-test3-scale5.png', png3)
        console.log('✅ Gerado: code93-test3-scale5.png (scale 5)\n')
    } catch (e) {
        console.log('❌ Erro:', e.message, '\n')
    }

    // Teste 4: Só height, sem width
    console.log('Teste 4: Só height, sem width')
    try {
        const png4 = await bwipjs.toBuffer({
            bcid: 'code93',
            text: testValue,
            height: 8,
            scale: 3,
            includetext: false,
            includecheck: true,
        })
        fs.writeFileSync('code93-test4-height-only.png', png4)
        console.log('✅ Gerado: code93-test4-height-only.png (height 8, scale 3)\n')
    } catch (e) {
        console.log('❌ Erro:', e.message, '\n')
    }

    // Teste 5: Sem includecheck
    console.log('Teste 5: Sem includecheck')
    try {
        const png5 = await bwipjs.toBuffer({
            bcid: 'code93',
            text: testValue,
            scale: 3,
            includetext: false,
            includecheck: false,
        })
        fs.writeFileSync('code93-test5-no-check.png', png5)
        console.log('✅ Gerado: code93-test5-no-check.png (sem checksum)\n')
    } catch (e) {
        console.log('❌ Erro:', e.message, '\n')
    }

    // Teste 6: Com parsefnc
    console.log('Teste 6: Com parsefnc')
    try {
        const png6 = await bwipjs.toBuffer({
            bcid: 'code93',
            text: testValue,
            scale: 3,
            includetext: false,
            includecheck: true,
            parsefnc: true,
        })
        fs.writeFileSync('code93-test6-parsefnc.png', png6)
        console.log('✅ Gerado: code93-test6-parsefnc.png (com parsefnc)\n')
    } catch (e) {
        console.log('❌ Erro:', e.message, '\n')
    }

    console.log('=== TESTES CONCLUÍDOS ===')
    console.log('Verifique as imagens geradas na pasta do projeto')
    console.log('Compare com sua etiqueta original para ver qual está correto\n')
}

testCode93().catch(console.error)
