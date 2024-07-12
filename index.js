//creo un server estatico con express (modulo externo)

const express = require(`express`)
//const session = require('express-session')
const override = require('method-override')
const rutas = require('./src/routes/mainRoutes.js')
const login = require('./src/routes/loginRoutes.js')
const app = express()
const auth = require('./src/config/auth.js')
const path = require('path')
const admin = require('firebase-admin')
const serviceAccount = require('./src/firebaseConfig.json')

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'YOUR_BUCKET_NAME.appspot.com'
});

const bucket = admin.storage().bucket()

const port = 8080 || process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('views', (__dirname + '/src/views'))

//app.use(express.static(__dirname + '/public'))
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(override('_metodo'))

// Configure multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() })

app.post('/upload', upload.single('archivo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
        resumable: false
    });

    blobStream.on('error', (err) => {
        console.error(err);
        res.status(500).send('Something went wrong!');
    });

    blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(200).send({ fileUrl: publicUrl });
    });

    blobStream.end(req.file.buffer);
});


//Es mejor ejecutar primero las rutas de login y luego las que necesiten 'auth'
app.use('/login', login) // /login/login o /login/registro
app.use('/', rutas)
app.use('/', auth, rutas)


//app.use('/admin', auth, rutasAdmin) // /admin/loquesea /admin/xyz


app.use((req, res, next) => {
    res.status(404).send(`<h1 style="color: red"> Recurso no encontrado!</h1>`)
})

//const IP = '127.0.0.1';

app.listen(port, () => console.log(`Hola, estoy arriba en el puerto: ${port}`))