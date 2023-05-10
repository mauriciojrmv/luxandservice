const { response, request } = require('express')
const multer = require('multer');
const solicitud = require("request");
const fs = require("fs");
const firebase = require("firebase-admin");
const serviceAccount = require('../privateKey.json');

//const firebaseToken = 'dt4Bvc-QQGSODXWYp2hUaV:APA91bH4pW9NJhwTgEHYvVZwmg8jc3iKYk8mXVLVcvMNmBPCklavnNe2lf-hUAz7c4asUSs_hAAmKZQIYF2ZbfICkBl3mSIeCAMTUvJpLF4s8fdFMx6nrCCJ5DoO26REhdDZXUuN6-qc';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // /uploadsEspecifica el directorio donde se almacenará la imagen
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Especifica el nombre del archivo
    }
});
const upload = multer({ storage: storage }).single('image');
const subirImagenes = (req = request, res = response) => {
    upload(req, res, function (err) {
        const { name, store, image } = req.body;
        if (err) {
            // Maneja cualquier error
            return res.status(500).json({ error: err.message });
        }
        // La imagen se ha subido correctamente
        res.status(200).json({ message: 'Imagen subida correctamente', path: req.file.path, name: name, store: store });
    });
}



firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
});

const algoGet = (req = request, res = response) => {
    const query = req.query;
    //tambien podemos desestructurar
    //const {q,nombre = 'No Name',apiKey} =req.query;
    res.json({
        msg: 'get API - Controlador',
        query
    })
}

const crearCaraPost = (req = request, res = response) => {
        upload(req, res, function (err) {
        const { name } = req.body;
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const options = {
            method: 'POST',
            url: "https://api.luxand.cloud/v2/person",
            headers: {
                'token': process.env.API_TOKEN
            },
            formData: {
                name: name,
                photos: fs.createReadStream(req.file.path),
                store: "1"
            }
        };
        solicitud(options, function (error, response) {
            if (error) throw new Error(error);
            const nuevoBody = JSON.parse(response.body);
            res.json({
                msg: 'post API - Controlador',
                body: nuevoBody
            })
        });
    });
}

const algoPut = (req = request, res = response) => {
    //res.send('hello World');

    const id = req.params.id;

    res.json({
        msg: 'put API - Controlador',
        id
    })
}
const algoPost = (req = request, res = response) => {
    const { url } = req.body;
    const options = {
        method: 'POST',
        url: "https://api.luxand.cloud/photo/search/v2",
        qs: {},
        headers: {
            'token': process.env.API_TOKEN
        },
        formData: {
            photo: url
        }
    };
    solicitud(options, function (error, response, body) {
        const nuevoBody = JSON.parse(response.body);
        res.json({
            msg: 'post API - Controlador',
            body: nuevoBody
        })
    });
}
const notificacionesPost = (req, res = response) => {
    const { tittle, body, token, image } = req.body;
    const payload = {
        notification: {
            title: tittle,
            body: body,
            image: image,
            //click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        //image:image,
        data: {
            data1: 'data1 value',
            data2: 'data2 value'
        }
    };
    const options = { priority: 'high', timeToLive: 60 * 60 * 24, };

    firebase.messaging().sendToDevice(token, payload, options).then(response => {
        res.json({
            msg: 'Se recibio su notificacion',
            response
        })
    });
}
const algoDelete = (req, res = response) => {
    //res.send('hello World');
    res.json({
        msg: 'delete API - Controlador'
    })
}
module.exports = {
    algoGet,
    algoPost,
    algoPut,
    algoDelete,
    notificacionesPost,
    crearCaraPost,
    subirImagenes
}