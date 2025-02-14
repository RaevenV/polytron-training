const mysql = require("../module/mysql_connector");

module.exports = {
  insert: async function (data) {
    try {
      await mysql.connectAsync();
      console.log("MySQL connected successfully");
      console.log("Inserting data:", data);

      var sql =
        "INSERT INTO ms_company (company_name, company_address, company_phone) VALUES (?, ?, ?)";
      var [result, cache] = await mysql.executeAsync(sql, [
        data.company_name,
        data.company_address,
        data.company_phone,
      ]);

      console.log("Insert result:", result);
      await mysql.endPool();
      return [result, null];
    } catch (error) {
      console.log("MySQL error:", error); // Log the error here
      await mysql.endPool();
      return [null, error];
    }
  },
  delete: async function(id){
    try {
      await mysql.connectAsync();
      const sql = "DELETE FROM ms_company WHERE company_id = ?"
      const [result] = await mysql.executeAsync(sql, [id]);
      return [result, null];
    } catch (error) {
      console.error("Error deleting!:", error);
      return [null, error];
    } finally {
      await mysql.endPool();
    }
  }
  ,
  get: async function () {
    try {
      await mysql.connectAsync();
      const sql = "SELECT * FROM ms_company";
      const [result] = await mysql.executeAsync(sql);
      return [result, null];
    } catch (error) {
      console.error("Error getting companies:", error);
      return [null, error];
    } finally {
      await mysql.endPool();
    }
  },
  getById: async function (id) {
    console.log("Company ID:", id); // Debugging step to check the ID
    try {
      await mysql.connectAsync();
      const sql = "SELECT * FROM ms_company WHERE company_id = ?";
      const [result] = await mysql.executeAsync(sql, [id]);
      console.log("Result:", result); // Check what is returned
      return [result, null];
    } catch (error) {
      console.error("Error getting the company :", error);
      return [null, error];
    } finally {
      await mysql.endPool();
    }
  },
};
