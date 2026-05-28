// Este arquivo é onde serao adicionadas todas as ferramentas personalizadas para este modpack.


StartupEvents.registry('item', event => {

    // Wooden Soft Mallet
    event.create('soft_mallet', 'pickaxe')
         .texture('kubejs:item/soft_mallet')
         .maxDamage(59)
         .tier('wood')
         .displayName('Soft Mallet')         
         .maxStackSize(1)
         .tag('forge:tools')
         .tag('forge:tools/mallets')
         .tag('forge:tools/hammers'); 

    // Mortar
    event.create('mortar')
         .texture('kubejs:item/mortar') 
         .displayName('Mortar')    
         .maxDamage(128)     
         .maxStackSize(1)
         .tag('forge:tools')
         .tag('forge:tools/mortars');

    // Iron Hammer
    event.create('iron_hammer', 'pickaxe')
         .texture('kubejs:item/iron_hammer')
         .maxDamage(256)
         .tier('iron')
         .displayName('Iron Hammer')
         .maxStackSize(1)
         .tag('forge:tools')
         .tag('forge:tools/hammers');

    // File
    event.create('file')
         .texture('kubejs:item/file')
         .maxDamage(256)
         .displayName('File')
         .maxStackSize(1)
         .tag('forge:tools')
         .tag('forge:tools/files');

    // Screwdriver
    event.create('screwdriver')
         .texture('kubejs:item/screwdriver')
         .maxDamage(256)
         .displayName('Screwdriver')
         .maxStackSize(1)
         .tag('forge:tools')
         .tag('forge:tools/screwdrivers');

    // Saw
    event.create('iron_saw', 'axe')
         .texture('kubejs:item/iron_saw')
         .maxDamage(256)
         .tier('iron')
         .displayName('Saw')
         .maxStackSize(1)
         .tag('forge:tools')
         .tag('forge:tools/saws');

});