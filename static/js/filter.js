const options = {"per":['id', 't_001', 't_024', 't_046', 't_100', 't_368', 't_370', 't_372', 't_373', 't_374', 't_375', 't_377', 't_400', 't_500', 't_510', 't_667', 't_670', 't_678', 'id_BNE', 'otros_identificadores', 'fecha_nacimiento', 'fecha_muerte', 'nombre_de_persona', 'otros_atributos_persona', 'lugar_nacimiento', 'lugar_muerte', 'pais_relacionado', 'otros_lugares_relacionados', 'lugar_residencia', 'campo_actividad', 'grupo_o_entidad_relacionada', 'ocupacion', 'genero', 'lengua', 'otros_nombres', 'persona_relacionada', 'nota_general', 'fuentes_de_informacion', 'otros_datos_biograficos', 'obras_relacionadas_en_el_catalogo_BNE'],
                "geo":['id','id_BNE', 'otros_identificadores', 'coordenadas_lat_lng', 'CDU', 'nombre_de_lugar', 'otros_nombres_de_lugar', 'entidad_relacionada', 'materia_relacionada', 'lugar_relacionado', 'nota_general', 'fuentes_de_informacion', 'lugar_jerarquico', 'obras_relacionadas_en_el_catalogo_BNE','id', 't_001', 't_024', 't_034', 't_080', 't_151', 't_451', 't_510', 't_550', 't_551', 't_667', 't_670', 't_781'],
                "mon":['id',"t_001",
    "t_008",
    "t_017",
    "t_020",
    "t_024",
    "t_035",
    "t_040",
    "t_041",
    "t_080",
    "t_100",
    "t_110",
    "t_130",
    "t_245",
    "t_246",
    "t_260",
    "t_264",
    "t_300",
    "t_440",
    "t_490",
    "t_500",
    "t_504",
    "t_505",
    "t_546",
    "t_561",
    "t_586",
    "t_594",
    "t_600",
    "t_610",
    "t_611",
    "t_630",
    "t_650",
    "t_651",
    "t_653",
    "t_655",
    "t_700",
    "t_710",
    "t_740",
    "t_752",
    "t_770",
    "t_772",
    "t_773",
    "t_774",
    "t_775",
    "t_776",
    "t_777",
    "t_787",
    "t_800",
    "t_810",
    "t_811",
    "t_830",
    "t_980",
    "t_994",
    "per_id",
    "pais_de_publicacion",
    "lengua_principal",
    "otras_lenguas",
    "lengua_original",
    "fecha_de_publicacion",
    "decada",
    "siglo",
    "deposito_legal",
    "isbn",
    "nipo",
    "cdu",
    "autores",
    "titulo",
    "mencion_de_autores",
    "otros_titulos",
    "edicion",
    "lugar_de_publicacion",
    "editorial",
    "extension",
    "otras_caracteristicas_fisicas",
    "dimensiones",
    "material_anejo",
    "serie",
    "nota_de_contenido",
    "notas",
    "procedencia",
    "premios",
    "tema",
    "genero_forma",
    "tipo_de_documento"]
};

let li_counter = 0;

const navigate_ul = (ul) => {
    const lis = Array(...ul.getElementsByTagName("li"));
    return lis.at(li_counter).innerHTML;
};

const set_ss_text = (li) => {
    const children = [...li.parentElement.parentElement.getElementsByTagName("input")];
    children.at(0).value = li.innerHTML;
    li.parentElement.remove();
};

const set_value = (option) => {
    const input = option.parentElement.parentElement.getElementsByClassName("v")[0];
    input.disabled = false;
    if (input.value[0] == "!") {
        input.value = input.value.substring(1);
    };
};

const without_value = (option) => {
    const input = option.parentElement.parentElement.getElementsByClassName("v")[0];
    input.disabled = false;
    if (input.value[0] != "!") {
        input.value = `!${input.value}`;
    };
};

const regardless_value = (option) => {
    option.parentElement.parentElement.getElementsByClassName("v")[0].disabled = true;
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
    dropdown.style = "top:90%; z-index:3;"
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
    setTimeout(() => deleter(), 3500);
};

const and_or_switch = (switch_element) => {
    const [and,_, or] = [...switch_element.parentElement.parentElement.children];
    // console.log(`${switch_element.parentElement.parentElement.parentElement.getElementsByTagName("input")[1].checked}`);
    if (switch_element.checked) {
        and.className = "";
        or.className = "text-primary";
    }else {
        and.className = "text-primary";
        or.className = "text-";
    };
};