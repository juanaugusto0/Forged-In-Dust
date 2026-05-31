// Receitas para a produção dos itens de microcrafting

ServerEvents.recipes(event => {

    const materials = ['iron', 'gold'];

    materials.forEach(material => {

        // Inputs (Usando tags para aceitar itens de qualquer mod)
        const ingotTag = `#forge:ingots/${material}`;
        const plateTag = `#forge:plates/${material}`;
        const doublePlateTag = `#forge:double_plates/${material}`;
        const rodTag = `#forge:rods/${material}`;
        const boltTag = `#forge:bolts/${material}`;
        const screwTag = `#forge:screws/${material}`;
        const ringTag = `#forge:rings/${material}`;
        const rotorTag = `#forge:rotors/${material}`;
        const foilTag = `#forge:foils/${material}`;
        const curvedPlateTag = `#forge:curved_plates/${material}`;

        // Outputs (Resultados precisam ser IDs exatos)
        const plateOut = `kubejs:${material}_plate`;
        const doublePlateOut = `kubejs:${material}_double_plate`;
        const densePlateOut = `kubejs:${material}_dense_plate`;
        const rodOut = `kubejs:${material}_rod`;
        const boltOut = `kubejs:${material}_bolt`;
        const screwOut = `kubejs:${material}_screw`;
        const ringOut = `kubejs:${material}_ring`;
        const rotorOut = `kubejs:${material}_rotor`;
        const foilOut = `kubejs:${material}_foil`;
        const curvedPlateOut = `kubejs:${material}_curved_plate`;

        // 1. Plate
        event.shaped(plateOut, [
            'H',
            'I',
            'I'
        ], {
            H: '#forge:tools/hammers',
            I: ingotTag
        }).damageIngredient('#forge:tools/hammers');

        // 2. Double Plate
        event.shaped(doublePlateOut, [
            'H',
            'P',
            'P'
        ], {
            H: '#forge:tools/hammers',
            P: plateTag
        }).damageIngredient('#forge:tools/hammers');

        // 3. Dense Plate       
        event.recipes.create.compacting(densePlateOut, `4x ${doublePlateTag}`);

        // 4. Rod
        event.shaped(rodOut, [
            'F',
            'I'
        ], {
            F: '#forge:tools/files',
            I: ingotTag
        }).damageIngredient('#forge:tools/files');

        // 5. Bolt
        event.shaped(`2x ${boltOut}`, [
            'S',
            'R'
        ], {
            S: '#forge:tools/saws',
            R: rodTag
        }).damageIngredient('#forge:tools/saws');

        // 6. Screw
        event.shaped(screwOut, [
            'F',
            'B'
        ], {
            F: '#forge:tools/files',
            B: boltTag
        }).damageIngredient('#forge:tools/files');



        // 8. Ring

        event.shaped(ringOut, [
            'HF',
            ' B'
        ], {
            H: '#forge:tools/hammers',
            F: '#forge:tools/files',
            B: boltTag
        }).damageIngredient('#forge:tools/hammers').damageIngredient('#forge:tools/files');


        // 9. Rotor
        event.shaped(rotorOut, [
            'HPF',
            'PRP',
            ' P '
        ], {
            P: plateTag,
            R: ringTag,
            F: '#forge:tools/files',
            H: '#forge:tools/hammers'
        }).damageIngredient('#forge:tools/hammers').damageIngredient('#forge:tools/files');

        // 10. Foil
        event.shaped(foilOut, [
            'H',
            'P'
        ], {
            H: '#forge:tools/hammers',
            P: plateTag
        }).damageIngredient('#forge:tools/hammers');


    });
});