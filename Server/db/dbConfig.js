const mysql = require('mysql2/promise');

const dbconnection = mysql.createPool({
    user: "evangadi_admin",
    password: "66578990",
    host: "localhost",
    database: "evangadi_db",
    connectionLimit: 10
});






// Test the connection
async function testConnection() {
    try {
        const [rows] = await dbconnection.execute("SELECT 'test' AS test");
        console.log(rows);
    } catch (err) {
        console.log(err.message);
    }
}

testConnection();

module.exports = dbconnection;
