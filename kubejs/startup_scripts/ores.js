// Este arquivo é onde serao adicionados todas os minerios personalizados para este modpack.

StartupEvents.registry('item', event => {
    
    // Dictionary of materials and their hex colors
    const materials = {
        iron: 0xD8D8D8,
        gold: 0xFDF55F,
        copper: 0xE77C56,
        zinc: 0x98BEA9
        // You can easily add more materials here later!
    };

    // Array of stages that require the dirt overlay
    const impureStages = ['raw_impure', 'crushed_impure', 'pulverized_impure'];

    // Loop through each material (iron, gold, etc.)
    Object.keys(materials).forEach(material => {
        
        // 1. Generate the Impure Stages (2 Layers: Base + Dirt)
        impureStages.forEach(stage => {
            event.create(`${stage}_${material}`)
                .modelJson({
                    parent: 'minecraft:item/generated',
                    textures: {
                        layer0: `kubejs:item/${stage}_base`,        // Layer 0: The gray stone base
                        layer1: `kubejs:item/dirt_overlay_${stage}` // Layer 1: The brown dirt details
                    }
                })
                .color(0, materials[material]); // Applies the color ONLY to layer0 (the stone)
        });

        // 2. Generate the Dust Stage (1 Layer: Only the colored powder)
        event.create(`${material}_dust`)
            .texture('kubejs:item/dust_base')
            .color(0, materials[material]); // Applies color to the dust
    });
});