const mysql = require("../module/mysql_connector");

module.exports = {
  get: async function (id) {
      try {
        await mysql.connectAsync();
        const sql = "SELECT * FROM ms_employee WHERE company_id = ?";
        const [result] = await mysql.executeAsync(sql, [id]);
        console.log(result);
        return [result, null];
      } catch (error) {
        console.error("Error getting employees:", error);
        return [null, error];
      } finally {
        await mysql.endPool();
      }
    },
    getById: async function (id) {
      console.log("Employee ID:", id);
      try {
        await mysql.connectAsync();
        const sql = "SELECT * FROM ms_employee WHERE company_id = ?";
        const [result] = await mysql.executeAsync(sql, [id]);
        console.log("Result:", result);
        return [result, null];
      } catch (error) {
        console.error("Error getting the company :", error);
        return [null, error];
      } finally {
        await mysql.endPool();
      }
    },delete: async function(id){
        try {
          await mysql.connectAsync();
          const sql = "DELETE FROM ms_employee WHERE employee_id = ?"
          const [result] = await mysql.executeAsync(sql, [id]);
          return [result, null];
        } catch (error) {
          console.error("Error deleting!:", error);
          return [null, error];
        } finally {
          await mysql.endPool();
        }
      }
};
