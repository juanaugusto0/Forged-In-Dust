// Receitas para todas as ferramentas personalizadas do modpack.

ServerEvents.recipes(event => {

    // Wooden Soft Mallet
    event.shaped('kubejs:soft_mallet', [
        'MMM',
        ' S ',
        ' S '
    ], {
        M: '#minecraft:logs', 
        S: 'minecraft:stick'
    });

    // Mortar
    event.shaped('kubejs:mortar', [
        ' P ',
        'B B',
        ' B '
    ], {
        P: 'minecraft:flint',
        B: 'minecraft:stone'
    });

    // Iron Hammer
    event.shaped('kubejs:iron_hammer', [
        'PIP',
        ' R ',
        ' R '
    ], {
        I: 'minecraft:iron_ingot',
        P: 'kubejs:iron_plate',
        R: 'minecraft:stick'
    });

    // File
    event.shaped('kubejs:file', [
        ' P',
        ' I',
        ' S'
    ], {
        P: 'kubejs:iron_plate',
        I: 'minecraft:iron_ingot',
        S: 'minecraft:stick'
    });

    // Saw
    event.shaped('kubejs:iron_saw', [
        'PP ',
        'PS ',
        ' S '
    ], {
        P: 'kubejs:iron_plate',
        S: 'minecraft:stick'
    });

    // Screwdriver 
    event.shaped('kubejs:screwdriver', [
        ' R',
        ' S'
    ], {
        R: 'kubejs:iron_rod',
        S: 'minecraft:stick'
    });

});