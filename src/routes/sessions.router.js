import { Router } from 'express';
import userModel from '../models/user.model.js';

const router = Router();

//Ruta users/register para registrar nuevos usuarios (POST)
router.post("/register", async (request, response) => {
    const { first_name, last_name, email, age, password } = request.body
    console.log("Registrando Usuario");
    console.log(request.body);

    const exists = await userModel.findOne({ email })
    if (exists) {
        return response.status(402).send({ status: "error", message: "Usuario ya existe!!" })
    }
    const user = {
        first_name,
        last_name,
        email,
        age,
        password // Se deberia encriptar
    }
    const result = await userModel.create(user);
    response.send({ status: "success", payload: user, message: "Usuario creado con extito con ID: " + result.id });
});

//Ruta users/login para loguear usuarios (POST)
router.post("/login", async (request, response) => {
    const { email, password } = request.body
    const user = await userModel.findOne({ email, password }) //Ya que el password no está hasheado, podemos buscarlo directamente
    
    if (!user) {
        const userByEmail = await userModel.findOne({ email });
        if (!userByEmail) {
            return response.status(401).json({ status: "error", error: "El correo no está registrado" });
        }
        return response.status(401).json({ status: "error", error: "Credenciales incorrectas" });
    }

    // Creo la Session
    request.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }
    if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
        request.session.user.rol = 'administrador'
    }else{
        request.session.user.rol = 'usuario'
    }

    response.send({ status: "success", payload: request.session.user, message: "Primer logueo realizado!!!" });
});

export default router;