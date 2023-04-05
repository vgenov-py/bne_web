const add_filter = (button) => {
    const container = document.querySelector("#filter_container");
    const node = document.querySelector(".filter_div").cloneNode(true);
    Array(...node.getElementsByTagName("input")).forEach((input) => input.value = null)
    container.appendChild(node)
    console.log();
};
const show_filters = () => {
    let result = "";
    const keys = Array(...document.getElementsByClassName("k"));
    const values = Array(...document.getElementsByClassName("v"));
    keys.forEach((key, i) => {
        key = key.value;
        let value = values.at(i).value;
        result += `${key}=${value}&`
    });
    return result.substring(0,result.length-1);

};
const trash_filter = (button) => {
    const div_filter = button.parentElement.parentElement.parentElement;
    if (div_filter.parentElement.children.length > 2) {
        div_filter.remove();
    };
};

const base_url = "http://139.162.183.85/api"
let query;

const get_data = async(blob=false) => {
    const dataset = document.querySelector("#dataset").value;
    const limit = document.querySelector("#limit").value;
    const view = document.querySelector("#view").value;
    let url = `${base_url}/${dataset}?limit=${limit}`
    const filters = show_filters();
    if (view) {
        url += `&view=${view}`
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
    return data;
};

const show_data = async() => {
    const results_div = document.querySelector("#results_div");
    const results = document.querySelector("#results");
    const spinner = document.querySelector("#results_spinner");
    const title = document.querySelector("#results_title");
    const download_button = document.querySelector("#download_button");
    download_button.className = "btn btn-dark disabled";
    download_button.innerHTML = "Descargar";
    results_div.className = "container-sm d-flex flex-column justify-content-center mt-5";
    spinner.className = "text-center";
    results.innerHTML = "";
    title.innerHTML = "";
    const data = await get_data();
    if (!data.success) {
        return
    }
    else if (data.length == 0) {
        title.innerHTML = `No hay resultados que cumplan el/los criterios de búsqueda`;
        spinner.className = "visually-hidden";
        return
    };
    console.log(data);
    spinner.className = "visually-hidden";
    title.innerHTML = `Resultados: ${data.length} - ${parseFloat(data.time).toFixed(2)}s`
    download_button.className = "btn btn-dark";
    const records = data.data.slice(0,10);

    const ul_k = document.createElement("ul");
        ul_k.className = "list-group list-group-horizontal";
        for (const [k,v] of Object.entries(records[0])) {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.innerHTML = k;
            ul_k.appendChild(li);
        };
        document.querySelector("#results").appendChild(ul_k);
    
    records.forEach((record) => {

        const ul = document.createElement("ul");
        ul.className = "list-group list-group-horizontal";
        for (const [k,v] of Object.entries(record)) {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.innerHTML = v;
            ul.appendChild(li);
        };
        results.appendChild(ul);
    });


}

const download_json = async (a) => {
    const spinner = Array(...document.querySelector("#results_spinner").children)[0].cloneNode();
    spinner.className = "spinner-border spinner-border-sm";
    a.innerHTML = "";
    a.appendChild(spinner);
    const file = await get_data(true);
    if (file) {
        a.href = file;
        a.download = `${document.querySelector("#dataset").value}.json`;
        a.setAttribute("onclick", "");
        a.click();
        a.setAttribute("onclick", "download_json(this)");
        a.innerHTML = "Descargado :)";
    }
    else {
        a.innerHTML = "No hay resultados";
    };

};