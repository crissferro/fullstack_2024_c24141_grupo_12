/*vercel: https://solocaps.vercel.app/ */
/* local:  http://localhost:8080/ */

document.querySelector('body').onload = async () => {
    const token = localStorage.getItem('jwt-token');
    console.log('Token from localStorage:', token); // Verifico el token

    // Cargar listado de productos
    try {
        const res = await fetch(`https://solocaps.vercel.app/listado`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            window.location.href = "/login.html";
            throw new Error("Problemas en login");
        }

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

        // Cargar tipos de productos y proveedores
        await Promise.all([cargarTiposProducto(token), cargarProveedores(token)]);
    } catch (error) {
        console.error('Error al cargar listado de productos:', error);
    }


    async function cargarTiposProducto(token) {
        try {
            const res = await fetch(`https://solocaps.vercel.app/tiposProducto`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error(`Error fetching tiposProducto: ${res.statusText}`);
            }

            const tiposProducto = await res.json();
            let selectTipoProducto = document.querySelector('#selecttipoProducto');
            selectTipoProducto.innerHTML = `
            <div class="list-datos_anexos-header">
                <h4>ID</h4>
                <h4>Nombre</h4>
            </div>
        `;
            tiposProducto.forEach(tipo => {
                selectTipoProducto.innerHTML += `
                <div class="list-datos_anexos-item">
                    <h5>${tipo.id}</h5>
                    <h5>${tipo.nombre}</h5>
                </div>`;
            });
        } catch (error) {
            console.error('Error al cargar tipos de producto:', error);
        }
    }

    async function cargarProveedores(token) {
        try {
            const res = await fetch(`https://solocaps.vercel.app/proveedores`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error(`Error fetching proveedores: ${res.statusText}`);
            }

            const proveedores = await res.json();
            let selectProveedores = document.querySelector('#proveedores');
            selectProveedores.innerHTML = `
            <div class="list-datos_anexos-header">
                <h4>ID</h4>
                <h4>Proveedor</h4>
                <h4>Marca</h4>
            </div>
        `;
            proveedores.forEach(proveedor => {
                selectProveedores.innerHTML += `
                <div class="list-datos_anexos-item">
                    <h5>${proveedor.id}</h5>
                    <h5>${proveedor.Proveedor}</h5>
                    <h5>${proveedor.alias}</h5>
                </div>`;
            });
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
        }
    }
};