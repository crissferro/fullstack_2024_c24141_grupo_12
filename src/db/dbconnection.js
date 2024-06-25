const mysql = require('mysql2')

const pool = mysql.createPool({
	host: 'tay.h.filess.io',
	user: 'solocaps_highwayhot',
	password: 'e85edbcfa15ffa946f90e243812a388156b02b0f',
	database: 'solocaps_highwayhot',
	port: 3307,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
})

module.exports = {
	conn: pool.promise()
}