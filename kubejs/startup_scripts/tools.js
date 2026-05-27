// Este arquivo é onde serao adicionadas todas as ferramentas personalizadas para este modpack.


StartupEvents.registry('item', event => {

    // Wooden Soft Mallet
    event.create('soft_mallet', 'pickaxe')
         .texture('kubejs:item/soft_mallet')
         .maxDamage(59)
         .tier('wood')
         .displayName('Soft Mallet')         
         .maxStackSize(1);                   

    // Mortar
    event.create('mortar')
         .texture('kubejs:item/mortar') 
         .displayName('Mortar')    
         .maxDamage(128)     
         .maxStackSize(1);                   

});