const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const { registrarUsuario, verificarUsuario, dataUser } = require("./consultas.js")
const bcrypt = require("bcryptjs")
const { middlewareValidador, registroRutas } = require("./middleware.js")
require("dotenv").config()

const app = express()

app.listen(3000, console.log("servidor ON"))

app.use(express.json())
app.use(cors())
app.use(registroRutas)

const key = process.env.LLAVESECRETA

app.post("/usuarios", async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body
        const registrarse = await registrarUsuario(email, password, rol, lenguage)
        res.status(201).json({
            id: registrarse[0].id,
            email: registrarse[0].email
        })
    } catch (error) {
        res.status(error.code || 500).send({
            message: "No se pudo registrar",
            code: 500
        })
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const usuarioVerificado = await verificarUsuario(email, password)
        const passwordVerify = bcrypt.compareSync(password, usuarioVerificado.password)
        if (!passwordVerify) {
            throw {
                code: 401,
                message: "La contraseña es incorrecta"
            }
        } else {
            const token = jwt.sign({
                email: usuarioVerificado.email,
                rol: usuarioVerificado.rol,
                lenguage: usuarioVerificado.lenguage
            }, key)
            res.status(200).send({ token })
        }
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})

app.get("/usuarios",middlewareValidador, async (req, res) => {
    try {
        const [_, token] = req.headers.authorization.split(" ")
        const { email } = jwt.verify(token, key)
        const usuario = await dataUser(email)
        res.json(usuario)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})   
