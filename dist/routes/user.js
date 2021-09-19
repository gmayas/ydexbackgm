"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_controller_1 = require("../controllers/user.controller");
router.get('/', (req, res) => {
    res.send({ Response: "APIRest for Yaydoo working", By: "© 2021 Copyright: GMayaS C:\>Desarrollo en Sistemas." }).status(200);
});
// User  
router.get('/getUsers', user_controller_1.getUsers);
router.get('/getUsers/:email', user_controller_1.getUserbyEmail);
router.get('/getDataUseFull', user_controller_1.getDataUseFull);
router.post('/createUser', user_controller_1.createUser);
router.post('/createUserArray', user_controller_1.createUserArray);
router.put('/modifyPassword/:id_user', user_controller_1.modifyPassword);
router.delete('/deleteUser/:id_user', user_controller_1.deleteUser);
// User data
router.get('/getUserDataByIdUser/:id_user', user_controller_1.getUserDataByIdUser);
router.post('/createUserData', user_controller_1.createUserData);
router.put('/modifyUserData/:id_userdata', user_controller_1.modifyUserData);
router.delete('/deleteUserData/:id_userdata', user_controller_1.deleteUserData);
//
exports.default = router;
