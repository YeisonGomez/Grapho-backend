import 'dotenv/config'

export const CONFIG = {
    PORT: Number(process.env.PORT) || 3310,
    JWT_SECRET: process.env.JWT_SECRET,
    DB: {
    	connectionLimit : 20,
		host: process.env.DBHOST || "127.0.0.1",
		port : process.env.DBPORT || 3306,
		user: process.env.DBUSER || "root",
		password: process.env.DBPASSWORD || "persian13",
		database : process.env.DBNAME || "grapho"
	},
}
