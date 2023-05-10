const  { Router } = require('express');
const { algoGet,algoPut,algoPost,algoDelete,notificacionesPost,crearCaraPost,subirImagenes} = require('../controllers/luxandController');


const router = Router();

router.get('/',algoGet);
router.put('/:id',algoPut );
router.post('/',algoPost);
router.post('/createface',crearCaraPost);
router.post('/notification',notificacionesPost);
router.post('/upload-image',subirImagenes);
router.delete('/',algoDelete);

module.exports = router;