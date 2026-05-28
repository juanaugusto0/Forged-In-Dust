// Lógica para processamento de minérios personalizados, incluindo as tabelas de loot para os blocos de minério e as receitas de transformação (esmagamento, moagem, lavagem e fundição).

ServerEvents.highPriorityData(event => {
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
    
        // Inputs KubeJS (Exclusivos do Modpack)
        const rawKubeJS = `kubejs:raw_impure_${material}`;
        const crushedKubeJS = `kubejs:crushed_impure_${material}`;
        const pulverizedKubeJS = `kubejs:pulverized_impure_${material}`;
        
        // Inputs Forge (Universais para pegar Vanilla, Create, Mekanism, etc.)
        const dustTag = `#forge:dusts/${material}`;
        const crushedTag = `#forge:crushed_ores/${material}`;
        const rawTag = `#forge:raw_materials/${material}`;

        // ==========================================
        // REMOÇÃO DO DERRETIMENTO PADRÃO
        // ==========================================
        // Remove as receitas que dariam 1 Ingot completo ao derreter esses itens
        ['minecraft:smelting', 'minecraft:blasting'].forEach(recipeType => {
            event.remove({ type: recipeType, input: dustTag });
            event.remove({ type: recipeType, input: crushedTag });
            event.remove({ type: recipeType, input: rawTag });
            event.remove({ type: recipeType, input: '#create:crushed_raw_materials' });
        });

        // ==========================================
        // PROCESSAMENTO DE MINÉRIOS (CRAFTING)
        // ==========================================
        // 1. Crushing: Raw + Hammer = Crushed
        event.shapeless(crushedKubeJS, [
            rawKubeJS, 
            '#forge:tools/hammers' 
        ]).damageIngredient('#forge:tools/hammers');

        // 2. Grinding: Crushed + Mortar = Pulverized
        event.shapeless(pulverizedKubeJS, [
            crushedKubeJS, 
            '#forge:tools/mortars'
        ]).damageIngredient('#forge:tools/mortars');


        // ==========================================
        // MECÂNICA DE DERRETIMENTO (YIELDS)
        // ==========================================

        // Nível 1: Raw (Impure KubeJS + Vanilla/Mods) -> 1x Nugget
        event.smelting(`1x ${nuggetOutput}`, rawKubeJS);
        event.blasting(`1x ${nuggetOutput}`, rawKubeJS);
        event.smelting(`1x ${nuggetOutput}`, rawTag);
        event.blasting(`1x ${nuggetOutput}`, rawTag);

        // Nível 2: Crushed (Impure KubeJS + Create/Mods) -> 3x Nuggets
        event.smelting(`3x ${nuggetOutput}`, crushedKubeJS);
        event.blasting(`3x ${nuggetOutput}`, crushedKubeJS);
        event.smelting(`3x ${nuggetOutput}`, crushedTag);
        event.blasting(`3x ${nuggetOutput}`, crushedTag);

        // Nível 3: Pulverized (Exclusivo KubeJS) -> 6x Nuggets
        event.smelting(`6x ${nuggetOutput}`, pulverizedKubeJS);
        event.blasting(`6x ${nuggetOutput}`, pulverizedKubeJS);

        // Nível 4 (Final): Dust (Universal Tag) -> 9x Nuggets
        event.smelting(`9x ${nuggetOutput}`, dustTag);
        event.blasting(`9x ${nuggetOutput}`, dustTag);
    
    });

});


const materials = ['iron', 'gold', 'copper', 'uranium', 'zinc', 'osmium', 'iesnium', 'tin', 'lead', 'silver', 'nickel', 'cobalt'];
const washRecipes = {};

materials.forEach(material => {
    washRecipes[`kubejs:pulverized_impure_${material}`] = `kubejs:${material}_dust`;
});

LevelEvents.tick(event => {
    const level = event.level;

    if (level.time % 20 !== 0) return;

    // Pega todas as entidades na dimensão
    let allEntities = level.getEntities();

    allEntities.forEach(entity => {
        if (entity.type !== 'minecraft:item') return;

        let currentItemId = entity.item.id;
        let resultDust = washRecipes[currentItemId];

        if (!resultDust) return;

        let inWater = entity.isInWater() || 
                      entity.block.id === 'minecraft:water' || 
                      (entity.block.properties && entity.block.properties.waterlogged === 'true');

        if (inWater) {
            let itemCount = entity.item.count;
            
            entity.item = Item.of(resultDust, itemCount);
            
            level.server.runCommandSilent(`playsound minecraft:block.brewing_stand.brew block @a ${entity.x} ${entity.y} ${entity.z} 0.5 1.0`);
            level.server.runCommandSilent(`particle minecraft:bubble_pop ${entity.x} ${entity.y + 0.2} ${entity.z} 0.2 0.2 0.2 0.1 15`);
        }
    });
});