const express = require('express')
const router = express.Router()
const controladores = require(`../controllers/mainController`)
//const multer = require('multer')
// const path = require('path')

router.post('/login', controladores.login);

// Ruta para verificar si el usuario está logueado
router.get('/check-session', controladores.checkSession);

// Ruta de logout
router.get('/logout', controladores.logout);

/*
const storage = multer.diskStorage({
	destination: (req, file, cb) =>{
		cb(null, `public/img/`)
	},
	filename: (req, file, cb) =>{
		console.log(file)
		cb(null. Date.now() + "_" + file.originalname)
	}
})*/

//const uploadFile = multer({storage})

router.get("/listado", controladores.getListado)
router.post('/listado', controladores.crearRegistro)
router.get('/modificar/:id', controladores.getModificar)
router.put('/modificar', controladores.actualizar)
router.delete('/listado', controladores.eliminar)

module.exports = router