const jwt = require("jsonwebtoken")
require("dotenv").config()

const key = process.env.LLAVESECRETA

const middlewareValidador = (req, res, next) => {

    const credenciales = req.headers.authorization
    if (!credenciales) {
        console.log("no hay credenciales")
        return res.status(401).send({ message: "Sin autorizacion, cabecera sin credenciales" })
    }

    const [bearer, token] = credenciales.split(" ")
    if (bearer !== "Bearer" || !token) {
        return res.status(401).send({ message: "Sin Autorizacion, Token no válido" })
    }

    try {
        jwt.verify(token, key)
        return next()
    } catch (error) {
        return res.status(401).send({ message: "Sin Autorizacion, Verifique credenciales" })
    }
}

const registroRutas = (req, res, next) => {
    const ruta = req.url
    console.log(`se ha recibido una peticion de la ruta ${ruta}`)
    next()
}

module.exports = { middlewareValidador, registroRutas }
