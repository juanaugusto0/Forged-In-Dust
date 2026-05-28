// Este arquivo é onde serao adicionados todas os minerios personalizados para este modpack.

StartupEvents.registry('item', event => {
    const materials = {
        iron: 0xD8D8D8,
        gold: 0xFDF55F,
        copper: 0xE77C56,
        uranium: 0x52C443,
        zinc: 0x98BEA9,
        osmium: 0x7B93A8,
        iesnium: 0x12B0A6,
        tin: 0x9EC7C9,
        lead: 0x444654,
        silver: 0xD9F1F4,
        nickel: 0xBFBA86,
        cobalt: 0x193A70
    };

    const impureStages = {
        'raw_impure': 'raw_materials',
        'crushed_impure': 'crushed_ores',
        'pulverized_impure': 'pulverized_ores'
    };

    Object.entries(materials).forEach(([material, hexColor]) => {
        
        Object.entries(impureStages).forEach(([stage, tagCategory]) => {
            event.create(`${stage}_${material}`)
                .modelJson({
                    parent: 'minecraft:item/generated',
                    textures: {
                        layer0: `kubejs:item/${stage}_base`,
                        layer1: `kubejs:item/dirt_overlay_${stage}`
                    }
                })
                .color(0, hexColor)
                .tag(`forge:${tagCategory}`)
                .tag(`forge:${tagCategory}/${material}`);
        });

        event.create(`${material}_dust`)
            .texture('kubejs:item/dust_base')
            .color(0, hexColor)
            .tag('forge:dusts')
            .tag(`forge:dusts/${material}`);
    });
});