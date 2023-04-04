const options = {"per":['id', 't_001', 't_024', 't_046', 't_100', 't_368', 't_370', 't_372', 't_373', 't_374', 't_375', 't_377', 't_400', 't_500', 't_510', 't_667', 't_670', 't_678', 'id_BNE', 'otros_identificadores', 'fecha_nacimiento', 'fecha_muerte', 'nombre_de_persona', 'otros_atributos_persona', 'lugar_nacimiento', 'lugar_muerte', 'pais_relacionado', 'otros_lugares_relacionados', 'lugar_residencia', 'campo_actividad', 'grupo_o_entidad_relacionada', 'ocupacion', 'genero', 'lengua', 'otros_nombres', 'persona_relacionada', 'nota_general', 'fuentes_de_informacion', 'otros_datos_biograficos', 'obras_relacionadas_en_el_catalogo_BNE'],
                "geo":['id', 't_001', 't_024', 't_034', 't_080', 't_151', 't_451', 't_510', 't_550', 't_551', 't_667', 't_670', 't_781', 'id_BNE', 'otros_identificadores', 'coordenadas_lat_lng', 'CDU', 'nombre_de_lugar', 'otros_nombres_de_lugar', 'entidad_relacionada', 'materia_relacionada', 'lugar_relacionado', 'nota_general', 'fuentes_de_informacion', 'lugar_jerarquico', 'obras_relacionadas_en_el_catalogo_BNE'],
                "mon":[]
};

let counter = 0;
const show_ul = (input) => {
    const dataset_to_search = dataset.value;
    const dropdown = document.createElement("ul");
    const deleter = () => {
        const input_container = input.parentElement.parentElement;
        const uls = Array(...input_container.getElementsByTagName("ul"));
        if (uls.length >= 1) {
            input_container.removeChild(uls[0]);
        };
        return input_container;
    };
    const input_container = deleter();
    const ss = input.value;
    counter ++;
    dropdown.className = "list-group position-absolute";
    dropdown.style = "top:90%"
    options[dataset_to_search].forEach((li) => {
        if (li.toLowerCase().search(ss.toLowerCase()) >= 0) {
        const new_li = document.createElement("li");
        new_li.className = "list-group-item";
        new_li.innerHTML =  li;
            dropdown.appendChild(new_li);
        };
    });
    input_container.appendChild(dropdown);
    setTimeout(() => deleter(), 3500);
};