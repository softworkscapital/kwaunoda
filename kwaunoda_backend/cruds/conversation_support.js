require("dotenv").config();
const pool = require("./poolfile");

let crudsObj = {};

crudsObj.postConversationSupport= (
    conversation_support_id,
    customer_id,
    customer_name,
    phone1,
    phone2,
    email,
    surname,
    company,
    product,
    conversation_stage,
    person_assigned,
    expiry_date_time,
    priority_level	

) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO conversation_support (
            customer_id,
            customer_name,
            phone1,
            phone2,
            email,
            surname,
            company,
            product,
            conversation_stage,
            person_assigned,
            expiry_date_time,
            priority_level	
              ) VALUES (?, ?, ?, ?, ?,?,?,?,?,?,?,?)`,
      [
       
        customer_id,
        customer_name,
        phone1,
        phone2,
        email,
        surname,
        company,
        product,
        conversation_stage,
        person_assigned,
        expiry_date_time,
        priority_level	


      ],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve({ status: "200", message: "saving successful", result });
      }
    );
  });
};

crudsObj.getConversationSupports = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM conversation_support", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

crudsObj.updateConversationSupport = (conversation_support_id, updatedValues) => {
    const {
         customer_id,
        customer_name,
        phone1,
        phone2,
        email,
        surname,
        company,
        product,
        conversation_stage,
        person_assigned,
        expiry_date_time,
        priority_level	
    } = updatedValues;

    console.log("Updating record with ID:", conversation_support_id);
    console.log("Updated values:", updatedValues);

    return new Promise((resolve, reject) => {
        pool.query(
            `UPDATE conversation_support SET 
                 customer_id =?,
                customer_name =?,
                phone1 =?,
                phone2 =?,
                email =?,
                surname =?,
                company =?,
                product =?,
                conversation_stage =?,
                person_assigned =?,
                expiry_date_time =?,
                priority_level =?	
            WHERE conversation_support_id = ?`,
            [
                customer_id,
                customer_name,
                phone1,
                phone2,
                email,
                surname,
                company,
                product,
                conversation_stage,
                person_assigned,
                expiry_date_time,
                priority_level	,
                conversation_support_id,
            ],
            (err, result) => {
                if (err) {
                    console.error("Error updating member:", err);
                    return reject(err);
                }
                if (result.affectedRows === 0) {
                    return resolve({
                        status: "404",
                        message: "Customer admin chat not found or no changes made",
                    });
                }
                return resolve({ status: "200", message: "Update successful", result });
            }
        );
    });
};


crudsObj.deleteConversationSupport= (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM conversation_support WHERE conversation_support_id = ?",
      [id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = crudsObj;
