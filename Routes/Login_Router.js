const express = require("express")
const router = express.Router()
const loginController = require("../Controller/Login_Controller")

router.post("/", loginController.create)
router.post("jWTLogin", loginController.login)
router.get("/getAll", loginController.getAll)
router.get('/getById/:id', loginController.getById); 
router.put('/updateById/:id', loginController.updateById); // New route to update a
router.delete('/delete/:id',loginController.delete)
module.exports = router