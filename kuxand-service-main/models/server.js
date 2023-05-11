const express = require('express')
const cors = require('cors')
class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.luxandPath = '/api/luxand';
        //Middlewares
        this.middlewares();
        //ritas de mi aplicaion

        this.routes();
    }
    
    middlewares(){
        //CORS
         // this.app.use(cors())
        const whiteList = ['http://localhost:4200','https://astounding-chebakia-00722d.netlify.app','https://prueba-438c5.web.app'];
        this.app.use(cors({
            origin : whiteList
        }))
        // const whiteList = ['http://localhost:4200'];
        // const corsOptions = {
        //     origin: function (origin, callback) {
        //       if (whitelist.indexOf(origin) !== -1) {
        //         callback(null, true)
        //       } else {
        //         callback(new Error('Not allowed by CORS'))
        //       }
        //     }
        //   }
        // lectura y parseo del body
        this.app.use(express.json());

        //directorio publico
        this.app.use( express.static('public'));
    }

    routes(){
        this.app.use(this.luxandPath, require('../routes/luxand'));
    }

    listen (){
        this.app.listen( this.port, ()=>{
            console.log('servidor corriendo en puerto',this.port);
        })
    }
}

module.exports = Server
