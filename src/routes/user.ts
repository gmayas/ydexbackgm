import { Router } from 'express';
const router = Router();

import { getUsers, getUserbyEmail, getDataUseFull, createUser, createUserArray, modifyPassword, deleteUser, 
         getUserDataByIdUser, createUserData, modifyUserData, deleteUserData } from '../controllers/user.controller';

router.get('/', (req, res) => {
    res.send({ Response: "APIRest for Yaydoo working", By: "© 2021 Copyright: GMayaS C:\>Desarrollo en Sistemas." }).status(200);
  });
// User  
router.get('/getUsers', getUsers );
router.get('/getUsers/:email', getUserbyEmail );
router.get('/getDataUseFull', getDataUseFull );
router.post('/createUser', createUser);
router.post('/createUserArray', createUserArray);
router.put('/modifyPassword/:id_user', modifyPassword);
router.delete('/deleteUser/:id_user', deleteUser);
// User data
router.get('/getUserDataByIdUser/:id_user', getUserDataByIdUser);
router.post('/createUserData', createUserData);
router.put('/modifyUserData/:id_userdata', modifyUserData);
router.delete('/deleteUserData/:id_userdata', deleteUserData);
//
export default router;