// Este script é responsável por registrar os itens de microcrafting, como placas, hastes, parafusos e placas duplas, para cada material definido. Ele utiliza uma abordagem dinâmica para criar os itens com base em um dicionário de materiais e tipos de peças, aplicando as texturas e cores correspondentes, além de adicionar as tags necessárias para integração com o sistema de tags do Forge.

StartupEvents.registry('item', event => {

    const materials = {
        iron: 0xD8D8D8,
        gold: 0xFDF55F
    };

    const partTypes = {
        'plate': 'plates',
        'rod': 'rods',
        'bolt': 'bolts',
        'double_plate': 'double_plates',
        'dense_plate': 'dense_plates', // Adicionado
        'screw': 'screws'              // Adicionado
    };

    Object.entries(materials).forEach(([material, hexColor]) => {
        
        Object.entries(partTypes).forEach(([part, tagCategory]) => {
            
            event.create(`${material}_${part}`)
                .texture(`kubejs:item/${part}_base`) 
                .color(0, hexColor)
                .tag(`forge:${tagCategory}`)
                .tag(`forge:${tagCategory}/${material}`);
                
        });
    });
});