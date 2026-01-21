const mysql = require("mysql2/promise");

const dbConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

// Logic to check database connection
(async () => {
  try {
    // We run a simple query to see if the connection is alive
    const [result] = await dbConnection.query("SELECT 'Connection Successful!' AS message");
    console.log(" Database Connection Status:", result[0].message);
    console.log(` Connected to: ${process.env.DB_NAME} at ${process.env.DB_HOST}`);
  } catch (err) {
    console.error(" Database Connection Failed!");
    console.error("Reason:", err.message);
   }
})();

module.exports = dbConnection;