const mysql = require('../module/mysql_connector')
module.exports ={
    select: async function(){
        try {
            await mysql.connectAsync()
            var sql= "SELECT id, col_number, col_text, col_varchar, col_timestamp FROM tbl_select";
            var [result,cache] = await mysql.queryAsync(sql)
            await mysql.endPool()
            return [result[0], null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    insert: async function(data){
        try {
            await mysql.connectAsync()
            var sql= "INSERT INTO tbl_insert (col_insert_number, col_insert_text, col_insert_varchar) VALUES(?,?,?)";
            var [result,cache] = await mysql.executeAsync(sql,[data.col_number, data.col_text, data.col_varchar])
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    }
}