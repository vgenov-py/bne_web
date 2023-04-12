const options = {"per":['id', 't_001', 't_024', 't_046', 't_100', 't_368', 't_370', 't_372', 't_373', 't_374', 't_375', 't_377', 't_400', 't_500', 't_510', 't_667', 't_670', 't_678', 'id_BNE', 'otros_identificadores', 'fecha_nacimiento', 'fecha_muerte', 'nombre_de_persona', 'otros_atributos_persona', 'lugar_nacimiento', 'lugar_muerte', 'pais_relacionado', 'otros_lugares_relacionados', 'lugar_residencia', 'campo_actividad', 'grupo_o_entidad_relacionada', 'ocupacion', 'genero', 'lengua', 'otros_nombres', 'persona_relacionada', 'nota_general', 'fuentes_de_informacion', 'otros_datos_biograficos', 'obras_relacionadas_en_el_catalogo_BNE'],
                "geo":['id','id_BNE', 'otros_identificadores', 'coordenadas_lat_lng', 'CDU', 'nombre_de_lugar', 'otros_nombres_de_lugar', 'entidad_relacionada', 'materia_relacionada', 'lugar_relacionado', 'nota_general', 'fuentes_de_informacion', 'lugar_jerarquico', 'obras_relacionadas_en_el_catalogo_BNE','id', 't_001', 't_024', 't_034', 't_080', 't_151', 't_451', 't_510', 't_550', 't_551', 't_667', 't_670', 't_781'],
                "mon":['id', 't_001', 't_035', 't_040', 't_100', 't_130', 't_245', 't_260', 't_300', 't_500', 't_899', 't_927', 't_980', 't_994']
};

let li_counter = 0;

const navigate_ul = (ul) => {
    const lis = Array(...ul.getElementsByTagName("li"));
    // lis.at(li_counter).style.backgroundColor = "red";
    return lis.at(li_counter).innerHTML;
};

const set_ss_text = (li) => {
    const children = [...li.parentElement.parentElement.getElementsByTagName("input")];
    children.at(0).value = li.innerHTML;
    li.parentElement.remove();
};

const show_ul = (input) => {
    
    const dataset_to_search = dataset.value;
    const dropdown = document.createElement("ul");
    dropdown.setAttribute("add",`navigate_ul(this)`);
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
    dropdown.className = "list-group position-absolute";
    dropdown.style = "top:90%"
    options[dataset_to_search].forEach((li) => {
        if (li.toLowerCase().search(ss.toLowerCase()) >= 0) {
        const new_li = document.createElement("li");
        new_li.className = "list-group-item li_hover";
        new_li.innerHTML =  li;
        new_li.setAttribute("onclick", "set_ss_text(this)");
        // new_li.setAttribute("onmouseover", "set_ss_text(this)");
        dropdown.appendChild(new_li);
        };
    });
    input_container.appendChild(dropdown);
    if (window.event.keyCode == "40") {
        const input_container = input.parentElement.parentElement;
        const uls = Array(...input_container.getElementsByTagName("ul"));
        if (uls.length >= 1) {
            const ul = input_container.removeChild(uls[0]);
            input.value = navigate_ul(ul);
        };
        // return;
    }
    // setTimeout(() => deleter(), 3500);
};