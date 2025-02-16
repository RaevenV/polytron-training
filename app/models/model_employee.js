const mysql = require("../module/mysql_connector");

module.exports = {
  edit: async function (id, name, gender,birthday,picture, phone) {
    console.log("Employee ID:", id);
    try {
      await mysql.connectAsync();
      const sql =
        "UPDATE ms_employee SET employee_name=?, employee_gender=?, employee_birthday=?,employee_picture=?,employee_phone=? WHERE employee_id = ?";
      const [result] = await mysql.executeAsync(
        sql,
        [name, gender,birthday,picture,phone, id]
      );
      console.log("Result:", result);
      return [result, null];
    } catch (error) {
      console.error("Error editing the employee! :", error);
      return [null, error];
    } finally {
      await mysql.endPool();
    }
  },
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
      const sql = "SELECT * FROM ms_employee WHERE employee_id = ?";
      const [result] = await mysql.executeAsync(sql, [id]);
      console.log("Result:", result);
      return [result, null];
    } catch (error) {
      console.error("Error getting the employee :", error);
      return [null, error];
    } finally {
      await mysql.endPool();
    }
  },
  delete: async function (id) {
    try {
      await mysql.connectAsync();
      const sql = "DELETE FROM ms_employee WHERE employee_id = ?";
      const [result] = await mysql.executeAsync(sql, [id]);
      return [result, null];
    } catch (error) {
      console.error("Error deleting!:", error);
      return [null, error];
    } finally {
      await mysql.endPool();
    }
  },
  insert: async function (data) {
    try {
      await mysql.connectAsync();
      console.log("MySQL connected successfully");
      console.log("Inserting data:", data);

      var sql =
        "INSERT INTO ms_employee (company_id, employee_name, employee_gender, employee_birthday, employee_picture, employee_phone) VALUES (?, ?, ?, ?, ?, ?)";
      var [result, cache] = await mysql.executeAsync(sql, [
        data.company_id,
        data.employee_name,
        data.employee_gender,
        data.employee_birthday,
        data.employee_picture,
        data.employee_phone,
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
};
