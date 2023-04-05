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

const get_data = async() => {
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
        // const blob = await res.blob()
        // const file = window.URL.createObjectURL(blob);
        // res = await fetch(url);
        // const a_download = document.querySelector("#download_button");
        // a_download.href = file;
        // a_download.a_download = `${dataset}.json`;
        // a_download.target = "_blank";
        // a_download.click();
        // a_download.remove();
    const data = await res.json();
    return data;
};

const show_data = async() => {
    const results_div = document.querySelector("#results_div");
    const results = document.querySelector("#results");
    const spinner = document.querySelector("#results_spinner");
    results_div.className = "container-sm d-flex flex-column justify-content-center mt-5";
    spinner.className = "text-center";
    results.innerHTML = "";
    const data = await get_data();
    if (!data.success) {
        return
    };
    spinner.className = "visually-hidden";
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

// const download = async(a) => {
//     const url = `${base_url}/per`
//     const options = {};
//     const res = await get_data(true);
//     const blob = await res.blob();
//     const file =  window.URL.createObjectURL(blob);
//     a.href = file;
//     // fetch(url, options)
//     // .then( res => res.blob() )
//     // .then( async blob => {
//     //     const file = window.URL.createObjectURL(blob);
//     //     window.location.assign(file);
//     //     a.href = file;
//     //     a.download = "per.json";
//     //     a.target = "_blank"
//     // });
// };

// console.log(download);

// download()