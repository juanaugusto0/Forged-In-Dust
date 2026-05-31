
CreateJuan.anvilForged(event => {
    let items = event.getItems();
    
    // 1. Garante que existem exatamente 2 itens na bigorna
    if (items.length === 2) {
        let itemA = items[0];
        let itemB = items[1];

        // 2. Verifica se ambos os itens possuem a tag de chapa (plate)
        let isAPlate = itemA.hasTag('forge:plates');
        let isBPlate = itemB.hasTag('forge:plates');
        
        // 3. Verifica se são rigorosamente o mesmo tipo de item (ex: ferro com ferro)
        let isSameMetal = (itemA.id === itemB.id);

        if (isAPlate && isBPlate && isSameMetal) {
            // Descobre o nome do metal dinamicamente para gerar o ID do resultado
            // Exemplo: 'minecraft:iron_plate' vira 'iron'
            let metalName = itemA.id.split(':')[1].replace('_plate', '');
            let resultItemId = `kubejs:${metalName}_curved_plate`;

            // 4. ETAPA DE SIMULAÇÃO (Check): Avisa o Java que a receita é válida
            event.accept();
            if (event.isCheck()) return; // Interrompe aqui se o Java só queria validar o início do minijogo

            // 5. ETAPA DE EXECUÇÃO REAL (Roda após o jogador vencer o minijogo)
            event.clearAnvil();
            event.spawnResult(Item.of(resultItemId));
        }
    }
});