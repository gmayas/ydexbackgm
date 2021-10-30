import { Router } from 'express';
const router = Router();

import { getDataJsonbyId, createDataJson  } from '../controllers/datajson.controller';

router.get('/', (req, res) => {
  res.send({ Response: "APIRest for Lupita working", By: "© 2021 Copyright: GMayaS C:\>Desarrollo en Sistemas." }).status(200);
});

// DataJson  
router.get('/getDataJsonbyId/:id', getDataJsonbyId );
router.post('/createDataJson', createDataJson);
//
export default router;