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
    console.log(url)
    const res = await fetch(url);
    const data = await res.json();
    return data;
};

const show_data = async() => {
    const results = document.querySelector("#results");
    results.innerHTML = "";
    
    const data = await get_data();
    if (!data.success) {
        return
    };
    const records = data.data.slice(0,10);
    `
    <ul class="list-group list-group-horizontal">
  <li class="list-group-item">An item</li>
  <li class="list-group-item">A second item</li>
  <li class="list-group-item">A third item</li>
</ul>`;
    console.log(records)

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

