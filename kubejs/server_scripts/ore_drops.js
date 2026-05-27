ServerEvents.highPriorityData(event => {
    
    // Lista de minérios e seus respectivos drops customizados
    const oreConfigurations = [
        { name: 'iron_ore', drop: 'kubejs:raw_impure_iron' },
        { name: 'deepslate_iron_ore', drop: 'kubejs:raw_impure_iron' },
        
        { name: 'gold_ore', drop: 'kubejs:raw_impure_gold' },
        { name: 'deepslate_gold_ore', drop: 'kubejs:raw_impure_gold' },
        
        { name: 'copper_ore', drop: 'kubejs:raw_impure_copper' },
        { name: 'deepslate_copper_ore', drop: 'kubejs:raw_impure_copper' }
    ];

    oreConfigurations.forEach(ore => {
        // Estrutura padrão de Loot Table vanilla do Minecraft
        const lootTableJson = {
            type: "minecraft:block",
            pools: [
                {
                    rolls: 1,
                    bonus_rolls: 0,
                    entries: [
                        {
                            type: "minecraft:alternatives",
                            children: [
                                // 1. Se quebrar com Toque de Seda (Silk Touch), dropa o próprio bloco
                                {
                                    type: "minecraft:item",
                                    name: `minecraft:${ore.name}`,
                                    conditions: [
                                        {
                                            condition: "minecraft:match_tool",
                                            predicate: {
                                                enchantments: [
                                                    {
                                                        enchantment: "minecraft:silk_touch",
                                                        levels: { min: 1 }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                // 2. Caso contrário, dropa o item customizado com bônus de Fortuna (Fortune)
                                {
                                    type: "minecraft:item",
                                    name: ore.drop,
                                    functions: [
                                        {
                                            function: "minecraft:apply_bonus",
                                            enchantment: "minecraft:fortune",
                                            formula: "minecraft:ore_drops"
                                        },
                                        {
                                            function: "minecraft:explosion_decay"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        // Injeta o JSON simulando um datapack. 
        // Geramos em 'loot_tables' (1.20-) e 'loot_table' (1.21+) para garantir compatibilidade entre versões.
        event.addJson(`minecraft:loot_tables/blocks/${ore.name}.json`, lootTableJson);
        event.addJson(`minecraft:loot_table/blocks/${ore.name}.json`, lootTableJson);
    });
});


ServerEvents.recipes(event => {

    const crushingRecipes = [
        { raw: 'kubejs:raw_impure_iron', crushed: 'kubejs:crushed_impure_iron' },
        { raw: 'kubejs:raw_impure_gold', crushed: 'kubejs:crushed_impure_gold' },
        { raw: 'kubejs:raw_impure_copper', crushed: 'kubejs:crushed_impure_copper' }
    ];

    crushingRecipes.forEach(recipe => {
        event.shapeless(
            recipe.crushed,
            [ recipe.raw, 'kubejs:soft_mallet' ] // Apenas os IDs limpos
        ).damageIngredient('kubejs:soft_mallet');
    });

    const grindingRecipes = [
        { crushed: 'kubejs:crushed_impure_iron', pulverized: 'kubejs:pulverized_impure_iron' },
        { crushed: 'kubejs:crushed_impure_gold', pulverized: 'kubejs:pulverized_impure_gold' },
        { crushed: 'kubejs:crushed_impure_copper', pulverized: 'kubejs:pulverized_impure_copper' }
    ];

    grindingRecipes.forEach(recipe => {
        event.shapeless(
            recipe.pulverized,
            [ recipe.crushed, 'kubejs:mortar' ] // Apenas os IDs limpos
        ).damageIngredient('kubejs:mortar');
    });

    const smeltingRecipes = [
        { dust: 'kubejs:iron_dust', nugget: 'minecraft:iron_nugget' },
        { dust: 'kubejs:gold_dust', nugget: 'minecraft:gold_nugget' },
        
        // NOTA: O Minecraft Vanilla não tem pepita de cobre. 
        // Substitua 'kubejs:copper_nugget' pelo ID correto se estiver a usar um mod que adiciona (ex: 'create:copper_nugget')
        // ou crie o item nos seus startup_scripts se for 100% custom.
        { dust: 'kubejs:copper_dust', nugget: 'create:copper_nugget' } 
    ];

    smeltingRecipes.forEach(recipe => {
        // Receita da Fornalha Normal (Smelting) - Sintaxe: event.smelting('quantidadeX id_do_resultado', 'ingrediente')
        event.smelting(`9x ${recipe.nugget}`, recipe.dust);
        
        // Receita da Fornalha Potente (Blast Furnace) - Metade do tempo da fornalha normal
        event.blasting(`9x ${recipe.nugget}`, recipe.dust);
    });

});

LevelEvents.tick(event => {
    const level = event.level;

    // Otimização: Só executa a lógica a cada 20 ticks (1 segundo)
    if (level.time % 20 !== 0) return;

    // Mapeamento das receitas de lavagem
    const washRecipes = {
        'kubejs:pulverized_impure_iron': 'kubejs:iron_dust', 
        'kubejs:pulverized_impure_gold': 'kubejs:gold_dust',
        'kubejs:pulverized_impure_copper': 'kubejs:copper_dust'
    };

    // Pega todas as entidades na dimensão (sem argumentos em texto)
    let allEntities = level.getEntities();

    allEntities.forEach(entity => {
        // Filtra: Se não for um item caído no chão, ignora e passa para o próximo
        if (entity.type !== 'minecraft:item') return;

        // Pega o ID do item atual
        let currentItemId = entity.item.id;
        let resultDust = washRecipes[currentItemId];

        // Se o item não for um dos nossos pulverizados, ignora
        if (!resultDust) return;

        // Verifica se a entidade está efetivamente dentro de água
        let inWater = entity.isInWater() || 
                      entity.block.id === 'minecraft:water' || 
                      (entity.block.properties && entity.block.properties.waterlogged === 'true');

        if (inWater) {
            let itemCount = entity.item.count;
            
            // Substitui o item no chão pelo Dust limpo, mantendo o tamanho da pilha (stack)
            entity.item = Item.of(resultDust, itemCount);
            
            // Dispara as partículas e o som exatamente na coordenada do item
            level.server.runCommandSilent(`playsound minecraft:block.brewing_stand.brew block @a ${entity.x} ${entity.y} ${entity.z} 0.5 1.0`);
            level.server.runCommandSilent(`particle minecraft:bubble_pop ${entity.x} ${entity.y + 0.2} ${entity.z} 0.2 0.2 0.2 0.1 15`);
        }
    });
});