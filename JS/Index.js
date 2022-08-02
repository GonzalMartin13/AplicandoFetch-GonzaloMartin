


const chango = [];
const changuitoHTML = document.getElementById("chango");


const botonCliente = document.getElementById("BotonCliente");

botonCliente.onclick = () => { 
    let FondoBody = document.getElementById("Body");
    FondoBody.className = "fondoBodyCliente container-fluid row justify-content-center";
    let botonCarro = document.getElementById("BotonChango");
    botonCarro.className = "btn btn-secondary";
    const divCartas = document.getElementById("CartasProds");
    divCartas.className = "BienvenidaCartas text-center row justify-content-center align-items-center";
    divCartas.style = "border: black 5px solid";
    renderProds(divCartas)
};

const renderProds = (target) => {
    fetch(`./productos.json`)
  .then ((response)=> response.json())
  .then((datos)=>{
    
    let acumulador = '';
    datos.map(producto => {
        acumulador += `
        <div class=" col-4 m-2" style="width: 18rem" ;>
            <div class="card-body m-4">
                <h5 class=" m-2 card-title">${producto.nombre}</h5>
                <h6 class="card-subtitle mb-3 text-muted">${producto.parrafo}</h6>
                <img src=${producto.imgURL} width="100" height="175" class="card-img-top" alt="${producto.nombre}">
                <p class="mt-2 card-text">${producto.descripcion} </br> Precio: $${producto.precio}.</p>
                <button ref=${producto.codigo} class="boton_venta BP btn btn-secondary my-2 col-md-3" id=${`botonCarta` + producto.nombre} > Agregar al carrito</button>
            </div>
        </div>   
        `
    })

    target.innerHTML = acumulador;
    const botonesCompra = document.querySelectorAll(".BP");
    botonesCompra.forEach(button => button.addEventListener("click", handleClick));    

  });  
}  

const handleClick = (event) => {
    const codigo = event.target.getAttribute("ref");
    fetch(`./productos.json`)
    .then ((response)=> response.json())
    .then((datos)=>{
        const product = datos.find(linea => linea.codigo === codigo);
        Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: "Agregaste un producto al carrito",
            showConfirmButton: false,
            timer: 1000
        })
    
        if (chango.some(el => el.codigo === product.codigo)) {
            const posicionArray = chango.findIndex(el => el.codigo === product.codigo)
            chango[posicionArray].cantidad = chango[posicionArray].cantidad + 1;
        } else {
            chango.push({
                codigo : product.codigo,
                nombre: product.nombre,
                precio: product.precio,
                cantidad: 1,
                imgURL: product.imgURL,
            })
        }
        guardarCarroSS(chango);
    
        let changoSS = recuperarCarroSS();
        renderChango(changoSS, changuitoHTML);
        console.log(changoSS);
    });  
}

    

const renderChango = (lineas, target) => {
    let acumulador = '';
    lineas.map(producto => {
        acumulador += `
        <div class=" col-4 m-2" style="width: 18rem" ;>
            <div class="card-body m-4">
                <h5 class=" m-2 card-title">${producto.nombre}</h5>
                <img src=${producto.imgURL} width="100" height="175" class="card-img-top" alt="${producto.nombre}">
                <p class="mt-2 card-text"> Cantidad selecionada: ${producto.cantidad} </br> Precio: $${producto.precio} </br> Precio Total: $${producto.precio * producto.cantidad}.</p>
                <div class="row justify-content-around">
                    <button ref=${producto.codigo} class="boton_venta BCA btn btn-secondary my-2 col-md-3" id="botonCarroAgregar" onclick= eliminarProducto("${producto.codigo}",0)> Agregar uno mas </button>
                    <button ref=${producto.codigo} class="boton_venta BCQ btn btn-secondary my-2 col-md-3" id="botonCarroQuitar" onclick= eliminarProducto("${producto.codigo}",1)> Quitar uno </button>
                </div>
            </div>
        </div>   
        `
    })

    target.innerHTML = acumulador;   

}
function eliminarProducto(id, condicion){
    let productoCarrito = recuperarCarroSS();
    let posicionEliminar = productoCarrito.findIndex(x => x.codigo == id);
   if (condicion == 1 ){

        productoCarrito[posicionEliminar].cantidad -=1;
        if (productoCarrito[posicionEliminar].cantidad == 0){
            productoCarrito.splice(posicionEliminar,1);
        }
        guardarCarroSS(productoCarrito);
        let changoSS = recuperarCarroSS();
       
    renderChango(changoSS, changuitoHTML);
        
  } else {
    productoCarrito[posicionEliminar].cantidad +=1;
    guardarCarroSS(productoCarrito);
    let changoSS = recuperarCarroSS();
    renderChango(changoSS, changuitoHTML);
  }
} 
  



function guardarCarroSS(carro) {
    sessionStorage.setItem("CarritoDeCompras", JSON.stringify(carro));
}

function recuperarCarroSS() {
    return JSON.parse(sessionStorage.getItem("CarritoDeCompras")) || [];
}















