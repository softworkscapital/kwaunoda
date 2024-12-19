require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postProspect = (prospect_name, prospect_surname, company, product, category, user_id, phone1, phone2, email, funnel_stage, message, nxtFollowup) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO prospect_details(prospect_name, prospect_surname, user_id, company, product, category, phone1, phone2, email, funnel_stage) VALUES (?,?,?,?,?,?,?,?,?,?)', [prospect_name, prospect_surname, user_id, company, product, category, phone1, phone2, email, funnel_stage], (err, result) => {
            if (err) {
                return reject(err);
            }

            const prospect_id = result.insertId;

            pool.query('INSERT INTO funnel_conversation(prospect_id, user_id, msg, msg_date, msg_time, next_follow_up) VALUES (?,?,?,?,?,?)', [prospect_id, user_id, message, currentDate, currentTime, nxtFollowup], (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'saving successful' });
            });
        });
    });
};

crudsObj.getProspects = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM prospect_details', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getProspectsById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM prospect_details WHERE prospect_id = ?',[id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

//get prospects by the userID
crudsObj.getProspectsByUserId = (userid) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM prospect_details WHERE user_id = ?',[userid], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};
crudsObj.getProspectsById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM prospect_details WHERE prospect_id = ?',[id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

// get prospect by funnel level
crudsObj.getProspectsByFunnel = (stage) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM prospect_details WHERE funnel_stage = ?',[stage], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

// get prospect by funnel level
crudsObj.getProspectsByNameSurname = (name, surname) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM prospect_details WHERE prospect_name = ? AND prospect_surname = ?',[name, surname], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.updateProspect = (id, prospect_name, prospect_surname, company, product, username, phone1, phone2, email, funnel_stage) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE prospect_details SET  prospect_name = ?, prospect_surname = ?, company = ?, product = ?, username = ?, phone1 = ?, phone2 = ?, email = ?, funnel_stage = ? WHERE prospect_id = ?',
            [prospect_name, prospect_surname, company, product, username, phone1, phone2, email, funnel_stage, id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'update successful' });
            }
        );
    });
};

//Update Stage
crudsObj.updateProspectStatus = (id, funnel_stage) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE prospect_details SET funnel_stage = ? WHERE prospect_id = ?',
            [funnel_stage, id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'update successful' });
            }
        );
    });
};

crudsObj.deleteProspect = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM prospect_details WHERE prospect_id = ?', [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};


// Current Date
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
  
    const currentDate = `${year}-${month}-${day}`;
    return currentDate;
  }
  //Get current time
  function getCurrentTime() {
    const today = new Date();
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const currentTime = today.toLocaleTimeString('en-US', options);
    return currentTime;
  }
  
  // Example usage:
  const currentTime = getCurrentTime();
  const currentDate = getCurrentDate();

module.exports = crudsObj;