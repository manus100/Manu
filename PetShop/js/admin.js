let idxEdit = null;

async function getProductsList() {
    productsList = await ajax("GET", url + '/produse.json');
    drawProductsTable();
}


function drawProductsTable() {
    let str = "";
    for (let i in productsList) {
        if (!productsList.hasOwnProperty(i)) {
            continue;
        }
        if (productsList[i] === null) {
            continue;
        }
        str += `
				<tr class='rowBorderBottom'>                    
                    <td style = "white-space:nowrap;">
                        <div class = 'imgAdmin' style= 'background-image: url("${productsList[i].Image}")'></div>
                    </td>
                    <td>
                        <a href = "javascript:edit('${i}');"  class="linkProductName">${productsList[i].Name}</a>
                    </td>
                    <td class = "cartField">${productsList[i].Price}</td>
                    <td class = "cartField" >${productsList[i].Qty}</td>
                    <td class = "cartField">${productsList[i].Tip}</td>
                    <td style = "white-space:nowrap;">
                        <div class="cartField cartBtns" onclick="del('${i}');">Sterge</div>
                    </td>
                </tr>
			`;
    }

    document.querySelector("#adminTable tbody").innerHTML = str;
    showTable();
}

function showTable() {
    idxEdit = null;
    document.querySelector('[type="submit"]').value = "Adauga";

    document.querySelector("form").style.display = "none";
    document.querySelector("table").style.display = "";

    document.querySelector("#pageTitle").innerHTML = 'Gestionare produse';
    document.querySelector("#btnAdd").classList.remove('hidden');

}

function showAddForm() {
    document.querySelector("form").reset();
    document.querySelector("form").style.display = "";
    document.querySelector("#adminTable").style.display = "none";
    document.querySelector("#pageTitle").innerHTML = 'Adaugare produs';
    document.querySelector("#btnAdd").classList.add('hidden');
    document.querySelector("#description").innerHTML = ''
}


function edit(idx) {
    showAddForm();
    idxEdit = idx;
    const el = productsList[idx];
    document.querySelector('[type="submit"]').value = "Salveaza";

    document.querySelector('[name="name"]').value = el.Name;
    document.querySelector('[name="img"]').value = el.Image;
    document.getElementById('description').innerHTML = el.Details;
    document.querySelector('[name="pret"]').value = el.Price;
    document.querySelector('[name="cantitate"]').value = el.Qty;
    document.querySelector('[name="tip"]').value = el.Tip;
}


async function add() {
    const el = {};

    //   if (validateUserInput()) {
    el.Name = document.querySelector('[name="name"]').value;
    el.Image = document.querySelector('[name="img"]').value;
    el.Details = document.querySelector('#description').value; //document.getElementById('description').value;
    el.Price = parseFloat(document.querySelector('[name="pret"]').value);
    el.Qty = parseInt(document.querySelector('[name="cantitate"]').value);
    el.Tip = document.querySelector('[name="tip"]').value;
    if (idxEdit === null) {
        //adaugare
        await ajax("POST", url + '/produse.json', JSON.stringify(el));
        await getProductsList();
    } else {
        //editare
        await ajax("PUT", `${url}/produse/${idxEdit}.json`, JSON.stringify(el));
        await getProductsList();
        idxEdit = null;
        document.querySelector('[type="submit"]').value = "Adauga";
    }
    //   }
}

async function del(idx) {
    if (confirm(`Sunteti sigur ca doriti sa stergeti produsul ${productsList[idx].Name}?`)) {
        await ajax("DELETE", `${url}/produse/${idx}.json`);
        await getProductsList();
    }
}

function validateUserInput() {
    var controls = document.getElementsByTagName("input");
    var invalid = 0;

    for (var i = 0; i < controls.length; i++) {
        if (controls[i].type !== 'submit' && controls[i].type !== 'button') {
            if (controls[i].value.length == 0) {
                controls[i].classList.add('invalid');
                //    controls[i].setCustomValidity('Nu ati completat acest camp!');
                return false;
                break;
                invalid++;
            } else {
                //    controls[i].setCustomValidity('');
                controls[i].classList.remove('invalid');
            }
        }
    }
    if (invalid == 0) {
        return true;
    } else {
        return false;
    }

}