const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

new bootstrap.Tooltip(document.body, {selector:".tooltip_bne"});
const tooltips = {
    per: {"id_BNE": "identificador de la persona en el catálogo de la BNE", "otros_identificadores": "identificadores de la persona en otros catálogos (viaf, lcnf, isni, etc.)", "fecha_nacimiento": "fecha de nacimiento de la persona", "fecha_muerte": "fecha de muerte de la persona", "nombre_de_persona": "", "otros_atributos_persona": "título, cargo, etc. ", "lugar_nacimiento": "país, región, provincia y localidad donde ha nacido la persona", "lugar_muerte": "país, región, provincia y localidad donde ha fallecido la persona", "pais_relacionado": "otro país relacionado con la persona", "otros_lugares_relacionados": "otros lugares relacionados con la persona", "lugar_residencia": "lugar de residencia de la persona, si es especialmente significativo", "campo_actividad": "disciplina o actividad a la que se dedica la persona", "grupo_o_entidad_relacionada": "grupo, organismo, etc., a la que pertenece la persona", "ocupacion": "profesión desempeñada por la persona", "genero": "género de la persona (masculino, femenino u otros)", "lengua": "lengua en la que la persona escribe la mayor parte de su obra", "otros_nombres": "otros nombres por los que es conocida la persona", "persona_relacionada": "otras personas relacionadas con la persona", "nota_general": "más información sobre la persona", "fuentes_de_informacion": "fuentes de información de las que se han obtenido los datos de la persona", "otros_datos_biograficos": "otra información biográfica de la persona", "obras_relacionadas_en_el_catalogo_BNE": "obras relacionadas con la persona que se pueden encontrar en el catálogo de la BNE", "nombre_de_persona": "nombre de persona"},
    geo: {
        id: "identifier from the authority file of the Biblioteca Nacional de España. Format for persons: 'XX' followed by 4 to 7 digits"
    },
    mon: {
        id: "X"
    }
};

const base_url = "http://139.162.183.85/api";
let fields;
const get_fields = async () => {
    const dataset = document.querySelector("#dataset").value;
    const url = `${base_url}/${dataset}?limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.data) {
        fields = Object.keys(data.data[0]);
    };
};
get_fields();

const reset_and_ors = () => {
    [...document.querySelectorAll(".bne_and_or")].forEach((and_or) => {
        and_or.getElementsByTagName("input")[0].checked = false;
    });
};

reset_and_ors();

const add_filter = (button) => {
    const container = document.querySelector("#filter_container");
    const node = [...document.querySelectorAll(".filter_div")].at(-1).cloneNode(true);
    const others_and_or_nodes = [...document.querySelectorAll(".bne_and_or")];
    others_and_or_nodes.forEach((and_or,i) => {
        and_or.className = "d-flex flex-row border-1 border mb-4 justify-content-center align-items-center bne_and_or";
        and_or.id = "bne_and_or_" + i;
        node.id = "bne_and_or_" + i;
        // and_or.click();
    });
    // node.querySelector(".bne_and_or").className = "visually-hidden";
    Array(...node.getElementsByTagName("input")).forEach((input) => input.value = null);
    container.appendChild(node);
};
const show_filters = () => {
    // let result = "";
    const test = {};
    keys_or = [];
    const keys = Array(...document.getElementsByClassName("k"));
    const values = Array(...document.getElementsByClassName("v"));
    keys.forEach((key, i) => {
        let value = values.at(i).value;
        let and_or_switch = key.parentElement.parentElement.parentElement.getElementsByClassName("bne_and_or")[0].getElementsByTagName("input")[0];
        key = key.value;
        if (and_or_switch.checked) {
            keys_or.push(key) 
        };
        if (key && value && fields.indexOf(key) >= 0) {
            if (test[key]) {
                test[key] = test[key] + "||" + value;
            } else {
                test[key] = value;
            };
            // result += `${key}=${value}&`;
        };
    });
    keys_or.forEach((key_or) => {
        test[key_or] += "||";
    });
    result = "";
    Object.entries(test).forEach((kv) => {
        result += `${kv.join("=")}&`
    });
    return result.substring(0,result.length -1);
    // return result.substring(0,result.length-1);
};
const trash_filter = (button) => {
    const div_filter = button.parentElement.parentElement.parentElement.parentElement;
    console.log(div_filter);
    if (div_filter.parentElement.children.length > 3) {
        if (div_filter.id == "bne_and_or_0") {
            console.log(document.getElementById(div_filter.id));
            document.getElementById(div_filter.id).className = "bne_and_or visually-hidden";
        }else {
            document.getElementById(div_filter.id).remove();
        };
        div_filter.remove();
    } else {
        div_filter.className += " bg-warning";
        setTimeout(() => {
            div_filter.className = div_filter.className.slice(0,div_filter.className.indexOf(" bg-warning"))
        }, 1000);
    };
};

let query;
let headers;

const get_data = async(blob=false, selected_fields=false) => {
    const dataset = document.querySelector("#dataset").value;
    const limit = document.querySelector("#limit").value;
    const view = document.querySelector("#view").value;
    const fields = selected_fields ? selected_fields: null;
    let url = `${base_url}/${dataset}?limit=${limit}`;
    const filters = show_filters();
    if (fields) {
        url += `&fields=${fields.join(",")}`;
    } else {
        url += `&view=${view}`;
    };
    if (filters) {
        url += `&${filters}`
    };
    console.log(url);

    let res = await fetch(url);
    if (blob) {
        const blob = await res.blob()
        return window.URL.createObjectURL(blob);
    };
    const data = await res.json();
    if (data.data) {
        try {
            headers = [...Object.keys(data.data[0])];
        }
        catch (e){
        };
    };
    return data;
};

const remove_col = (button) => {
    cls_name = button.className.split(" ").at(-1);
    headers.splice(headers.indexOf(cls_name),1);
    button.parentElement.parentElement.remove()
    elements = Array(...document.getElementsByClassName(cls_name));
    elements.forEach((element) => {
        element.remove();
    });
};

const show_data = async() => {
    const results_div = document.querySelector("#results_div");
    const spinner = document.querySelector("#results_spinner");
    const title = document.querySelector("#results_title");
    const download_button = document.querySelector("#download_button");
    const results_thead = document.querySelector("#results_thead");
    const results_tbody = document.querySelector("#results_tbody");
    results_thead.innerHTML = "";
    results_tbody.innerHTML = "";
    download_button.className = "btn btn-dark dropdown-toggle disabled";
    download_button.innerHTML = "Descargar";
    results_div.className = "container-sm d-flex flex-column justify-content-center mt-5";
    spinner.className = "text-center";
    title.innerHTML = "";
    const data = await get_data();
    if (!data.success) {
        return
    }
    else if (data.length == 0) {
        title.innerHTML = `No hay resultados que cumplan el/los criterios de búsqueda.`;
        spinner.className = "visually-hidden";
        return
    };
    console.log(data);
    spinner.className = "visually-hidden";
    title.innerHTML = `Resultados: ${data.length} - ${parseFloat(data.time).toFixed(2)}s`
    download_button.className = "btn btn-dark dropdown-toggle";
    const records = data.data.slice(0,10);

    const tr_k = document.createElement("tr");
    for (const [k,v] of Object.entries(records[0])) {
        const th = document.createElement("th");
        const btn_close = document.createElement("button");
        th.style.backgroundColor = "#39adcc"; //c8d8e4 078ca9
        btn_close.className = `d-inline btn-close text-white ${k}`;
        btn_close.setAttribute("onclick", "remove_col(this)");
        const tooltip_title = tooltips[dataset.value][k];
        th.innerHTML = `<div  class="d-flex justify-content-between text-white"><span class="tooltip_bne"data-bs-custom-class="tooltip_bne" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${tooltip_title}">${k}</span></div>`; // data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top"
        th.firstChild.appendChild(btn_close);
        tr_k.appendChild(th);
    };
    results_thead.appendChild(tr_k);
    records.forEach((record) => {
        const tr_v = document.createElement("tr");
        for (const [k,v] of Object.entries(record)) {
            const td = document.createElement("td");
            td.scope = "col";
            td.className = k;
            td.innerHTML = v;
            tr_v.appendChild(td);
        };
        results_tbody.appendChild(tr_v);
    });
}

const download_json = async (a) => {
    const spinner = Array(...document.querySelector("#results_spinner").children)[0].cloneNode();
    spinner.className = "spinner-border spinner-border-sm";
    a.innerHTML = "";
    a.appendChild(spinner);
    const div_button = [...a.parentElement.parentElement.parentElement.children][0];
    div_button.innerHTML = "";
    div_button.appendChild(spinner);
    const file = await get_data(true, headers);
    if (file) {
        a.href = file;
        a.download = `${document.querySelector("#dataset").value}.json`;
        a.setAttribute("onclick", "");
        a.click();
        a.setAttribute("onclick", "download_json(this)");
        a.innerHTML = `JSON <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-filetype-json" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM4.151 15.29a1.176 1.176 0 0 1-.111-.449h.764a.578.578 0 0 0 .255.384c.07.049.154.087.25.114.095.028.201.041.319.041.164 0 .301-.023.413-.07a.559.559 0 0 0 .255-.193.507.507 0 0 0 .084-.29.387.387 0 0 0-.152-.326c-.101-.08-.256-.144-.463-.193l-.618-.143a1.72 1.72 0 0 1-.539-.214 1.001 1.001 0 0 1-.352-.367 1.068 1.068 0 0 1-.123-.524c0-.244.064-.457.19-.639.128-.181.304-.322.528-.422.225-.1.484-.149.777-.149.304 0 .564.05.779.152.217.102.384.239.5.41.12.17.186.359.2.566h-.75a.56.56 0 0 0-.12-.258.624.624 0 0 0-.246-.181.923.923 0 0 0-.37-.068c-.216 0-.387.05-.512.152a.472.472 0 0 0-.185.384c0 .121.048.22.144.3a.97.97 0 0 0 .404.175l.621.143c.217.05.406.12.566.211a1 1 0 0 1 .375.358c.09.148.135.335.135.56 0 .247-.063.466-.188.656a1.216 1.216 0 0 1-.539.439c-.234.105-.52.158-.858.158-.254 0-.476-.03-.665-.09a1.404 1.404 0 0 1-.478-.252 1.13 1.13 0 0 1-.29-.375Zm-3.104-.033a1.32 1.32 0 0 1-.082-.466h.764a.576.576 0 0 0 .074.27.499.499 0 0 0 .454.246c.19 0 .33-.055.422-.164.091-.11.137-.265.137-.466v-2.745h.791v2.725c0 .44-.119.774-.357 1.005-.237.23-.565.345-.985.345a1.59 1.59 0 0 1-.568-.094 1.145 1.145 0 0 1-.407-.266 1.14 1.14 0 0 1-.243-.39Zm9.091-1.585v.522c0 .256-.039.47-.117.641a.862.862 0 0 1-.322.387.877.877 0 0 1-.47.126.883.883 0 0 1-.47-.126.87.87 0 0 1-.32-.387 1.55 1.55 0 0 1-.117-.641v-.522c0-.258.039-.471.117-.641a.87.87 0 0 1 .32-.387.868.868 0 0 1 .47-.129c.177 0 .333.043.47.129a.862.862 0 0 1 .322.387c.078.17.117.383.117.641Zm.803.519v-.513c0-.377-.069-.701-.205-.973a1.46 1.46 0 0 0-.59-.63c-.253-.146-.559-.22-.916-.22-.356 0-.662.074-.92.22a1.441 1.441 0 0 0-.589.628c-.137.271-.205.596-.205.975v.513c0 .375.068.699.205.973.137.271.333.48.589.626.258.145.564.217.92.217.357 0 .663-.072.917-.217.256-.146.452-.355.589-.626.136-.274.205-.598.205-.973Zm1.29-.935v2.675h-.746v-3.999h.662l1.752 2.66h.032v-2.66h.75v4h-.656l-1.761-2.676h-.032Z"/>
      </svg>`;
      div_button.innerHTML = "Descargar";
    }
    else {
        a.innerHTML = "No hay resultados";
    };

};
const download_csv = async (a) => {
    const spinner = Array(...document.querySelector("#results_spinner").children)[0].cloneNode();
    spinner.className = "spinner-border spinner-border-sm";
    a.innerHTML = "";
    a.appendChild(spinner);
    console.log(headers);
    const div_button = [...a.parentElement.parentElement.parentElement.children][0];
    div_button.innerHTML = "";
    div_button.appendChild(spinner);
    const data = await get_data(false,headers);
    if (data.data) {
        let keys = "";
        Object.keys(data.data[0]).forEach((r) => keys += `"${r?r:""}";`);
        let csv = `data:text/csv;charset=utf-8,${keys}\r\n`;
        data.data.forEach((record) => {
            let values = "";
            Object.values(record).forEach((r) => values += `"${r?r:""}";`);
            csv += values + "\r\n";
        });
        a.download = `${document.querySelector("#dataset").value}.csv`;
        a.setAttribute("href", encodeURI(csv));
        a.setAttribute("onclick", "");
        a.click();
        a.setAttribute("onclick", "download_csv(this)");
        a.innerHTML = `CSV<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-filetype-csv" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM3.517 14.841a1.13 1.13 0 0 0 .401.823c.13.108.289.192.478.252.19.061.411.091.665.091.338 0 .624-.053.859-.158.236-.105.416-.252.539-.44.125-.189.187-.408.187-.656 0-.224-.045-.41-.134-.56a1.001 1.001 0 0 0-.375-.357 2.027 2.027 0 0 0-.566-.21l-.621-.144a.97.97 0 0 1-.404-.176.37.37 0 0 1-.144-.299c0-.156.062-.284.185-.384.125-.101.296-.152.512-.152.143 0 .266.023.37.068a.624.624 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.092 1.092 0 0 0-.2-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.551.05-.776.15-.225.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.122.524.082.149.2.27.352.367.152.095.332.167.539.213l.618.144c.207.049.361.113.463.193a.387.387 0 0 1 .152.326.505.505 0 0 1-.085.29.559.559 0 0 1-.255.193c-.111.047-.249.07-.413.07-.117 0-.223-.013-.32-.04a.838.838 0 0 1-.248-.115.578.578 0 0 1-.255-.384h-.765ZM.806 13.693c0-.248.034-.46.102-.633a.868.868 0 0 1 .302-.399.814.814 0 0 1 .475-.137c.15 0 .283.032.398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.441 1.441 0 0 0-.489-.272 1.838 1.838 0 0 0-.606-.097c-.356 0-.66.074-.911.223-.25.148-.44.359-.572.632-.13.274-.196.6-.196.979v.498c0 .379.064.704.193.976.131.271.322.48.572.626.25.145.554.217.914.217.293 0 .554-.055.785-.164.23-.11.414-.26.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.799.799 0 0 1-.118.363.7.7 0 0 1-.272.25.874.874 0 0 1-.401.087.845.845 0 0 1-.478-.132.833.833 0 0 1-.299-.392 1.699 1.699 0 0 1-.102-.627v-.495Zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879l-1.327 4Z"/>
      </svg>`;
      div_button.innerHTML = "Descargar";
    };

};