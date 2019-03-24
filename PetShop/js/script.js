var url = 'https://petshop-3dc65.firebaseio.com/';
var produse = {};
var listaCos = {};
var produsCos = {};
var tipMancare;
var slideIndex = 0;
var cantitateInCos;



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

    ajax("GET", url + '/produse.json')
        .then(function (raspuns) {
            products = raspuns;
            showProducts();
        })
        .then(function () {
            getCart('');
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
            </a>
        </div>`
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

/** detaliile produsului selectat in pagina de index */
function getDetails(productID, refreshPage) {
    ajax("GET", `${url}/produse/${productID}.json`)
        .then(function (raspuns) {
            productDetails = raspuns;
            if (refreshPage) {
                showDetails(productDetails);
            }
        })
        .then(function () {
            if (refreshPage) {
                getCart('');
            }
        })
        .catch(function (err) {
            console.error(err);
        });
}

async function showDetails(detailsPromise) {

    startSpinner();
    var details = await detailsPromise;


    document.querySelector("#detailsProductImg").src = details.Image;
    document.querySelector("#nameBrand").innerHTML = details.Name;
    document.querySelector("#detailsProductDetail").innerHTML = details.Details;
    document.querySelector("#detailsProductPrice").innerHTML = details.Price + ' RON';
    if (details.Qty > 0) {
        document.querySelector("#disponibil").innerHTML = 'In stoc';
        document.querySelector("#disponibil").style.color = 'green';
        document.querySelector("#disponibil").style.fontWeight = 'bold'
    } else {
        document.querySelector("#disponibil").innerHTML = 'Indisponibil';
        document.querySelector("#disponibil").style.color = 'red';
    }
    document.querySelector("#disponibil").style.fontWeight = 'bold';

    //tipMancare = details.Tip

    stopSpinner();
    showSlides();
}

/* function getCart(productID) {
      if (productID == '') {
           ajax("GET", `${url}cos.json`)
               .then(function (raspuns) {
                   listaCos = raspuns;
                   showCart();
               })
               .catch(function (err) {
                   console.error(err);
               });
       } else {
           ajax("GET", `${url}cos/${productID}.json`)
               .then(function (resolve) {
                   objProdusCos = resolve;
                   if (objProdusCos != null) {
                       cantitateInCos = objProdusCos.Qty;
                   } else {
                       cantitateInCos = 0;
                   }
               })
               .then(function () {
                   getDetails(productID, false);
               })
               .then(function () {
                   saveToCart(productID);
               })
               .catch(console.error);
       }
   */
function getCart() {
    var cartList = JSON.parse(localStorage.getItem('cart'));
    if (cartList == null) {
        document.getElementById('cartItems').innerHTML = ' (0)';
    } else {
        document.getElementById('cartItems').innerHTML = ` (${cartList.length})`;
    }

}

function showCart() {
    let counter = 0
    for (var i in listaCos) {
        if (!listaCos.hasOwnProperty(i)) {
            continue;
        }
        if (listaCos[i] === null) {
            continue;
        }
        counter++;
    }
    document.getElementById('cartItems').innerHTML = ` (${counter})`;
}

/** Adauga produse in cos
 *   GET /cos/idProdus/cantitate  ==> cantitatea curenta; 
     PUT /cos/idProdus/
 * intai selectez din baza de date produsele din cos
 * verific daca id-ul de produs exista deja in cos
 * daca exista deja adaug cantitatea la cantitatea introdusa de user
 * verific sa nu depasesc stocul produsului
 */
function addToCart(productID) {

    if (document.getElementById('txtCantitate').value != '') {
        //daca produsul exista deja in cos, incrementez cantitatea
        document.getElementById('txtCantitate').classList.remove('invalid');
        getCart(productID);
    } else {
        document.getElementById('txtCantitate').classList.add('invalid');
    }
}

function saveToCart(productID) {
    let selectedQty;
    selectedQty = parseInt(document.getElementById('txtCantitate').value);

    //verific stocul produsului
    /* cantitateInCos += selectedQty;
           if (productDetails.Qty < selectedQty) {
               //stocul mai mic decat cantitatea introdusa
               alert('Cantinatea solicitata depaseste stocul produsului! \n\n  Va rugam sa introduceti o cantitate mai mica!')
           } else if (productDetails.Qty < cantitateInCos) {
               alert('Cantinatea totala solicitata depaseste stocul produsului! \n\n  Va rugam sa introduceti o cantitate mai mica!')
       
           } else {
               produsCos = {
                   Name: productDetails.Name,
                   Qty: cantitateInCos,
                   Price: productDetails.Price,
                   Image: productDetails.Image
               }
       
               //dc nu exista in cos nu dau cu POST ca imi pune el id-ul lui si eu vreau ID-ul produsului pe care l-a adaugat in cos
               ajax("PUT", `${url}cos/${productID}.json`, JSON.stringify(produsCos))
                   .then(function (resolve) {
                       if (resolve) {
                           document.getElementById('adToCartMessage').innerHTML = productDetails.Name + ' a fost adaugat in cos!'
                           document.getElementById('adToCartMessage').style.display = "block";
                           setTimeout(() => {
                               document.getElementById('adToCartMessage').style.display = "none";
                           }, 2000);
                       }
                   })
                   .then(function () {
                       getCart('');
                   })
       
                   .catch(function (err) {
                       console.error(err);
                   });
       */


    var i, itemFound;
    var cartList = JSON.parse(localStorage.getItem('cart'));
    if (cartList == null) {
        cartList = [];

    } else {
        //daca am ceva in cos, verific dc gasesc acelasi produs si in caz ca da, modific cantitatea; dc nu, adaug produsul in cartList
        itemFound = false;
        for (i = 0; i < cartList.length; i++) {
            if (productID == cartList[i].id) {
                //maresc cantitatea si modific in cart
                index = cartList.findIndex((obj => obj.id == productID));
                var newCartList = {
                    'id': productID,
                    'name': productDetails.Name,
                    'qty': selectedQty + parseInt(cartList[i].qty),
                    'img': productDetails.Image,
                    'stockQty': productDetails.Qty,
                    'price': productDetails.Price
                }

                cartList.splice(index, 1, newCartList);
                itemFound = true;
                break;
            }
        }
        if (cartList.length == 0 || itemFound == false) {
            cartList.push({
                'id': productID,
                'name': productDetails.Name,
                'qty': selectedQty,
                'img': productDetails.Image,
                'stockQty': productDetails.Qty,
                'price': productDetails.Price
            });
        }
    }


    localStorage.setItem('cart', JSON.stringify(cartList));
    document.getElementById('adToCartMessage').innerHTML = productDetails.Name + ' a fost adaugat in cos!'
    document.getElementById('adToCartMessage').style.display = "block";
    setTimeout(() => {
        document.getElementById('adToCartMessage').style.display = "none";
    }, 2000);

    getCart();

}













function showSlides() {
    var i;

    //https://console.firebase.google.com/project/petshop-3dc65/database/petshop-3dc65/data/produse/L_4raPSK8cONto6q7ra/Tip=%22Umeda%22 merge in firebase asa
    //dc scot id-ul nu mai merge
    /*      ajax("GET",  `${url}/produse/?Tip='Umeda'.json`)
           .then(function (raspuns) {
               lista = raspuns;
           })
       
    */
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    setTimeout(showSlides, 2000); // Change image every 2 seconds
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