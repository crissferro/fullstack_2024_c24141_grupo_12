const { conn } = require('../db/dbconnection');

module.exports = {

    getListado: async (req, res) => {
        try {
            console.log('Fetching list...')
            const [registros] = await conn.query(`SELECT 
                    p.id, 
                    p.nombre, 
                    p.descripcion, 
                    p.precio, 
                    tp.nombre AS tipoProducto, 
                    pr.alias AS proveedor
                FROM 
                    productos p
                JOIN 
                    tipoProducto tp ON p.id_tipoProducto = tp.id
                JOIN 
                    proveedor pr ON p.alias = pr.id;`);
            console.log('Fetched list:', registros);
            res.json(registros);
        } catch (error) {
            console.error('Error fetching list:', error)
            throw error
        } finally {
            conn.releaseConnection()
        }
    },

    getProveedores: async (req, res) => {
        try {
            const [proveedores] = await conn.query('SELECT * FROM proveedor');
            res.json(proveedores);
        } catch (error) {
            console.error('Error al obtener proveedores:', error);
            res.status(500).send('Error al obtener proveedores');
        }
    },

    getTiposProducto: async (req, res) => {
        try {
            const [tiposProducto] = await conn.query('SELECT * FROM tipoProducto');
            res.json(tiposProducto);
        } catch (error) {
            console.error('Error al obtener tipos de productos:', error);
            res.status(500).send('Error al obtener tipos de productos');
        }
    },


    crearRegistro: async (req, res) => {
        const sql = `
                INSERT INTO productos (nombre, descripcion, precio, id_tipoProducto, alias)
                VALUES (?, ?, ?, ?, ?)`;
        const creado = await conn.query(sql, [
            req.body.nombre,
            req.body.descripcion,
            parseFloat(req.body.precio),
            req.body.id_tipoProducto,
            req.body.alias
        ])
        console.log('Producto agregado:', creado);
        res.redirect('/listado.html');

    },

    getModificar: async (req, res) => {
        const [modificar] = await conn.query(`SELECT * FROM productos WHERE id=?`, req.params.id)
        console.log(modificar)
        res.render('modificar', {
            tituloDePagina: 'Página para Modificar Productos',
            registro: modificar[0]
        })
    },

    actualizar: async (req, res) => {
        const sql = `UPDATE productos SET nombre=?, descripcion=?, precio=?, id_tipoProducto=?, alias=? WHERE id=?`
        const { idMod, nombre, descripcion, precio, id_tipoProducto, alias } = req.body
        const modificado = await conn.query(sql, [nombre, descripcion, precio, id_tipoProducto, alias, idMod])
        console.log(modificado)
        res.redirect('/listado.html')
    },


    eliminar: async (req, res) => {
        const eliminado = await conn.query(`DELETE FROM productos WHERE id=?`, req.body.idEliminar)
        console.log(eliminado)
        res.redirect('/listado.html')
    },

}
