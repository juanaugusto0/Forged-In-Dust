ServerEvents.tags('item', event => {
    
    // Lista dos materiais que o Create possui em formato "crushed_raw"
    const createMaterials = [
        'iron', 
        'gold', 
        'copper', 
        'zinc', 
        'osmium', 
        'tin', 
        'lead', 
        'silver', 
        'nickel', 
        'uranium'
    ];

    createMaterials.forEach(material => {
        // Adiciona o item específico do Create na tag universal do Forge que o seu script usa
        event.add(`forge:crushed_ores/${material}`, `create:crushed_raw_${material}`);
    });

    // BÔNUS: Se você também quiser uma tag genérica que englobe TUDO do Create
    // (útil para filtros de inventário ou mochilas)
    event.add('forge:crushed_ores', '#create:crushed_raw_materials');

});