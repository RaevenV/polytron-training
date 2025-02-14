const mysql = require('../module/mysql_connector')
module.exports ={
    get: async function(){
        try {
            await mysql.connectAsync()
            var sql= "SELECT * FROM migrations";
            var [result,cache] = await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result[0], null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
}