document.querySelector('body').onload = async () => {
    try {
        const res = await fetch(`http://localhost:8080/listado`);
        const datos = await res.json();
        let listaHTML = document.querySelector(`#listado`);
        listaHTML.innerHTML = `
            <div class="list-header">
                <h4>Nombre</h4>
                <h4>Descripción</h4>
                <h4>Precio</h4>
                <h4>Tipo Producto</h4>
                <h4>Marca</h4>
                <h4>Acciones</h4>
            </div>
        `;
        datos.forEach(registro => {
            listaHTML.innerHTML += `
            <form method="POST" action="/listado?_metodo=DELETE" class="list-item">
                <h5>${registro.nombre}</h5>
                <h5>${registro.descripcion}</h5>
                <h5>${registro.precio}</h5>
                <h5>${registro.tipoProducto}</h5>
                <h5>${registro.proveedor}</h5>
                <input type="hidden" name="idEliminar" value="${registro.id}">
                <div id="acciones">
                <h5><a href="/modificar/${registro.id}">Modificar</a></h5>
                <h5><input type="submit" value="Eliminar"></h5>
                </div>
            </form>`;
        });
    } catch (error) {
        console.error('Error fetching list:', error);
    }
};
