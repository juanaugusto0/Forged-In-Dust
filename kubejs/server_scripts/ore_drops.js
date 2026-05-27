ServerEvents.highPriorityData(event => {
    // Apenas a lista mestre de metais
    const materials = ['iron', 'gold', 'copper', 'uranium', 'zinc', 'osmium', 'iesnium', 'tin', 'lead', 'silver', 'nickel', 'cobalt'];

    materials.forEach(material => {
        const dropItem = `kubejs:raw_impure_${material}`;
        
        // Pega uma lista com as IDs de TODOS os itens/blocos que possuem a tag desse minério
        const blocksInTag = Ingredient.of(`#forge:ores/${material}`).itemIds;

        blocksInTag.forEach(blockId => {
            // Separa a ID (Ex: "create:zinc_ore" vira modNamespace="create" e blockName="zinc_ore")
            const [modNamespace, blockName] = blockId.split(':');
            
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
                                    // 1. Toque de Seda (Silk Touch) dropa o próprio bloco dinamicamente
                                    {
                                        type: "minecraft:item",
                                        name: blockId, 
                                        conditions: [
                                            {
                                                condition: "minecraft:match_tool",
                                                predicate: {
                                                    enchantments: [{ enchantment: "minecraft:silk_touch", levels: { min: 1 } }]
                                                }
                                            }
                                        ]
                                    },
                                    // 2. Drop Customizado com Fortuna e Explosão
                                    {
                                        type: "minecraft:item",
                                        name: dropItem,
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

            // Injeta o JSON na pasta do mod correto automaticamente
            event.addJson(`${modNamespace}:loot_tables/blocks/${blockName}.json`, lootTableJson);
            event.addJson(`${modNamespace}:loot_table/blocks/${blockName}.json`, lootTableJson);
        });
    });
});


ServerEvents.recipes(event => {


    const materials = {
        iron: 'minecraft:iron_nugget',
        gold: 'minecraft:gold_nugget',
        copper: 'create:copper_nugget',
        uranium: 'mekanism:nugget_uranium', 
        zinc: 'create:zinc_nugget',
        osmium: 'mekanism:nugget_osmium',
        iesnium: 'occultism:iesnium_nugget', 
        tin: 'thermal:tin_nugget',
        lead: 'mekanism:nugget_lead',
        silver: 'thermal:silver_nugget',
        nickel: 'thermal:nickel_nugget',
        cobalt: 'tconstruct:cobalt_nugget'
    };

    Object.entries(materials).forEach(([material, nuggetOutput]) => {
        
        // Gera os IDs dinamicamente baseados no nome do material
        const raw = `kubejs:raw_impure_${material}`;
        const crushed = `kubejs:crushed_impure_${material}`;
        const pulverized = `kubejs:pulverized_impure_${material}`;
        const dust = `kubejs:${material}_dust`;

        // 1. Esmagar (Crushing): Raw + Mallet = Crushed
        event.shapeless(crushed, [raw, 'kubejs:soft_mallet']).damageIngredient('kubejs:soft_mallet');

        // 2. Moer (Grinding): Crushed + Mortar = Pulverized
        event.shapeless(pulverized, [crushed, 'kubejs:mortar']).damageIngredient('kubejs:mortar');

        // 3. Fundir (Smelting & Blasting): Dust -> 9x Nugget
        event.smelting(`9x ${nuggetOutput}`, dust);
        event.blasting(`9x ${nuggetOutput}`, dust);
        
    });

});


const materials = ['iron', 'gold', 'copper', 'uranium', 'zinc', 'osmium', 'iesnium', 'tin', 'lead', 'silver', 'nickel', 'cobalt'];
const washRecipes = {};

materials.forEach(material => {
    washRecipes[`kubejs:pulverized_impure_${material}`] = `kubejs:${material}_dust`;
});

// 2. O evento de Tick foca apenas na varredura do mundo
LevelEvents.tick(event => {
    const level = event.level;

    // Só executa a lógica a cada 20 ticks (1 segundo) para evitar lag
    if (level.time % 20 !== 0) return;

    // Pega todas as entidades na dimensão
    let allEntities = level.getEntities();

    allEntities.forEach(entity => {
        // Se não for um item caído no chão, ignora instantaneamente
        if (entity.type !== 'minecraft:item') return;

        let currentItemId = entity.item.id;
        let resultDust = washRecipes[currentItemId];

        // Se o item não estiver no nosso dicionário de lavagem, ignora
        if (!resultDust) return;

        // Verifica se a entidade está efetivamente dentro de água
        let inWater = entity.isInWater() || 
                      entity.block.id === 'minecraft:water' || 
                      (entity.block.properties && entity.block.properties.waterlogged === 'true');

        if (inWater) {
            let itemCount = entity.item.count;
            
            // Substitui o item no chão pelo Dust limpo, mantendo a quantidade da pilha
            entity.item = Item.of(resultDust, itemCount);
            
            // Dispara as partículas e o som exatamente na coordenada do item
            level.server.runCommandSilent(`playsound minecraft:block.brewing_stand.brew block @a ${entity.x} ${entity.y} ${entity.z} 0.5 1.0`);
            level.server.runCommandSilent(`particle minecraft:bubble_pop ${entity.x} ${entity.y + 0.2} ${entity.z} 0.2 0.2 0.2 0.1 15`);
        }
    });
});