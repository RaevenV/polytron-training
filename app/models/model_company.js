const mysql = require("../module/mysql_connector");

module.exports = {
  // function insert ini menerima data berbentuk json, lalu diaccess secara mandiri untuk diinput ke tabel ms_company melalui SQL Query
  insert: async function (data) {
    try {
      await mysql.connectAsync();
      console.log("MySQL connected successfully");
      console.log("Inserting data:", data);

      // terdapat penggunaan parameterized queries untuk menghindari SQL injection
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
      console.log("MySQL error:", error);
      await mysql.endPool();
      return [null, error];
    }
  },
  //function deletion yang menggunakan WHERE untuk mendelete berdasarkan id
  delete: async function (id) {
    try {
      await mysql.connectAsync();
      const sql = "DELETE FROM ms_company WHERE company_id = ?";
      const [result] = await mysql.executeAsync(sql, [id]);
      return [result, null];
    } catch (error) {
      console.error("Error deleting!:", error);
      return [null, error];
    } finally {
      await mysql.endPool();
    }
  },
  //function untuk mengambil semua data dari ms_company
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
  //function untuk mengambil data spesifik dari ms_company berdasarkan id

  getById: async function (id) {
    console.log("Company ID:", id);
    try {
      await mysql.connectAsync();
      const sql = "SELECT * FROM ms_company WHERE company_id = ?";
      const [result] = await mysql.executeAsync(sql, [id]);
      console.log("Result:", result);
      return [result, null];
    } catch (error) {
      console.error("Error getting the company :", error);
      return [null, error];
    } finally {
      await mysql.endPool();
    }
  },
  //function untuk melakukan edit untuk data sebuah company,dipastikan data yg ingin diubah benar melalui pengecekan company id
  edit: async function (id, name, address, phone) {
    console.log("Company ID:", id);
    try {
      await mysql.connectAsync();
      const sql =
        "UPDATE ms_company SET company_name=?, company_address=?, company_phone=? WHERE company_id = ?";
      const [result] = await mysql.executeAsync(
        sql,
        [name, address, phone, id]
      );
      console.log("Result:", result);
      return [result, null];
    } catch (error) {
      console.error("Error editing the company! :", error);
      return [null, error];
    } finally {
      await mysql.endPool();
    }
  },
};
