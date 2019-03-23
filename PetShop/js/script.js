var url = 'https://petshop-3dc65.firebaseio.com/';
var produse = {};

function startSpinner() {
    document.getElementById('spinner').style.display = 'block';
}

function stopSpinner() {
    document.getElementById('spinner').style.display = 'none';
}

async function ajax(method, url, body) {
    return new Promise(function (resolve, reject) {
        startSpinner();
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    stopSpinner();
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject(new Error("serverul a dat eroare"));
                }
            }
        };
        xhttp.open(method, url, true);
        xhttp.send(body);
    });
}


function getProducts() {

    ajax("GET", url + '.json')
        .then(function (raspuns) {
            products = raspuns;
            showProducts();
        })
        .catch(function (err) {
            console.error(err);
        });
}

function showProducts() {
    var str = "";
    for (var i in products) {
        if (!products.hasOwnProperty(i)) {
            continue;
        }
        if (products[i] === null) {
            continue;
        }
        str += `
       
        <div class = 'col-xs-12 col-sm-4 col-md-4 col-lg-3'  id='details'>
        <a href="details.html?productID=${i}"  onclick = "details('${i}')">      
            <div class = 'productDescription'>    
                <img class = "productImage" src = ${products[i].Image} />
                <div class = "productName">${products[i].Name}</div>
                <br>
                <div class = "productPrice">${products[i].Price}&nbsp;RON</div>
                <button class = "btnDetails" >Detalii</button>
            </div>   
        </a></div>`
    }
    document.getElementById('main').innerHTML = str;
}

function getProductIDFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var productID = params.get('productID');

    return productID;
}

/*async function getDetails(productID) {
    var detailsResponse = await fetch(`${url}${productID}.json`);  // preiau inf din bd
    var details = await detailsResponse.json();   //returneaza un obiect

    return details;
}
*/

function  getDetails(productID) {
    ajax("GET", `${url}${productID}.json`)
        .then(function (raspuns) {
            productDetails = raspuns;
            showDetails(productDetails);
        })
        .catch(function (err) {
            console.error(err);
        });

}

async function showDetails(detailsPromise) {

    startSpinner();
    var details = await detailsPromise;


        document.querySelector("#detailsProductImg").src=details.Image;
		document.querySelector("#nameBrand").innerHTML= details.Name;
		document.querySelector("#detailsProductDetail").innerHTML= details.Details;
        document.querySelector("#detailsProductPrice").innerHTML= details.Price;
        document.querySelector("#detailsProductQty").innerHTML= details.Qty;
   // document.getElementById('main').innerHTML = str;
    //   }, 500);
    stopSpinner();
}

//   setTimeout(() => {
    /*    var str = `
                <div id = "adToCartMessage" style = "display: none;">${details.Name} a fost adaugat in cos!</div>
                <div  class = 'col-xs-12 col-sm-12 col-md-8 col-lg-6'  id='productDetails'>
                <div id = "imageProductDetail"><img id = "imageDetail" src = "${details.Image}" /></div>
                <div id = "detailsAboutProduct"> 
                    <div>${details.Name}</div>
                    <div>Price: $${details.Price}</div>
                    <div>Qty: ${details.Qty}</div>
                </div>
                <button id = "addToCart" onclick = "addToCart(getDetails(getProductIDFromUrl()));">Adauga in cos</button>
                <div id = "detailsDescription">${details.Details}</div>
                </div>
                    `
    */