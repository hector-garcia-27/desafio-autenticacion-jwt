const { pool } = require("./database.js")
const bcrypt = require("bcryptjs")

const registrarUsuario = async (email, password, rol, lenguage) => {
    const query = "INSERT INTO usuarios (id, email, password, rol, lenguage) VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *;"
    const values = [email, bcrypt.hashSync(password), rol, lenguage]
    const { rows } = await pool.query(query, values)
    return rows
}

const verificarUsuario = async (email) => {
    const query = "SELECT * FROM usuarios WHERE email = $1;"
    const values = [email]
    const { rows } = await pool.query(query, values)
    if (!rows.length){
        throw {
            code: 404,
            message: `El usuario ${email} no existe`
        } 
    } else {
        return rows[0]
    }
}

const dataUser = async (email) => {
    const query = "SELECT * FROM usuarios WHERE email = $1;"
    const values = [email]
    const {rowCount, rows} = await pool.query(query, values)
    if (!rowCount) {
        throw {
            code: 404,
            message: "Usuario no encontrado"
        }
    } else {
        return rows
    } 
}

module.exports = { registrarUsuario, verificarUsuario, dataUser }