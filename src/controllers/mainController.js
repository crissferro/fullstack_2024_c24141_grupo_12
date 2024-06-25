const { conn } = require('../db/dbconnection');

module.exports = {

    login: async (req, res) => {
        const { username, password } = req.body;
        const sql = `SELECT * FROM usuarios WHERE username = ? AND password = ?`;
        const [user] = await conn.query(sql, [username, password]);
        if (user.length > 0) {
            req.session.user = user[0];
            res.redirect('/listado.html');
        } else {
            res.send('Usuario o contraseña incorrectos');
        }
    },

    getListado: async (req, res) => {
        if (!req.session.user) {
            return res.redirect('/login.html');
        }
        try {
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
            res.json(registros);
        } catch (error) {
            throw error;
        } 
    },

    getTiposProductos: async (req, res) => {
        try {
            const sql = `SELECT * FROM tipoProducto`;
            const [registros] = await conn.query(sql);
            res.json(registros);
        } catch (error) {
            throw error;
        }
    },

    getProveedores: async (req, res) => {
        try {
            const sql = `SELECT * FROM proveedor`;
            const [registros] = await conn.query(sql);
            res.json(registros);
        } catch (error) {
            throw error;
        }
    },

    checkSession: (req, res) => {
        if (req.session.user) {
            res.json({ loggedIn: true });
        } else {
            res.json({ loggedIn: false });
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

    logout: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/listado.html');
            }
            res.clearCookie('connect.sid');
            res.redirect('/index.html');
        });
    },

}
