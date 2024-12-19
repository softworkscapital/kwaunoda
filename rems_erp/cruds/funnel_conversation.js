require('dotenv').config();
const pool = require('./poolfile');

let crudsObj = {};

crudsObj.postFunnelCon = (prospect_id, msg, msg_date, msg_time, next_follow_up) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO funnel_conversation(prospect_id, msg, msg_date, msg_time, next_follow_up) VALUES (?,?,?,?,?)', [prospect_id, msg, msg_date, msg_time, next_follow_up], (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve({ statu: '200', message: 'saving successful' });
        })
    })
};

crudsObj.postFunnelCon2 = (prospect_id, user_id, msg, nxtFollowup,funnel_stage ) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO funnel_conversation(prospect_id, user_id, msg, msg_date, msg_time, next_follow_up) VALUES (?,?,?,?,?,?)', [prospect_id, user_id, msg, currentDate, currentTime, nxtFollowup], (err, result) => {
            if (err) {
                return reject(err);
            }

            pool.query('UPDATE prospect_details SET funnel_stage = ? WHERE prospect_id = ?',[funnel_stage, prospect_id],(err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve({ status: '200', message: 'update successful' });
                }
            );
        })
    })
};

crudsObj.getFunnelCons = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM funnel_conversation', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

// JOIN
crudsObj.getFunnelConsJoin = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT funnel_conversation.*, prospect_details.prospect_name, prospect_details.prospect_surname FROM funnel_conversation LEFT JOIN prospect_details ON funnel_conversation.prospect_id = prospect_details.prospect_id', (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getFunnelConsJoin2 = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT funnel_conversation.*, prospect_details.prospect_name, prospect_details.prospect_surname FROM funnel_conversation LEFT JOIN prospect_details ON funnel_conversation.prospect_id = prospect_details.prospect_id WHERE funnel_conversation.user_id = ?',[id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getFunnelConsJoin2 = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT funnel_conversation.*, prospect_details.prospect_name, prospect_details.prospect_surname FROM funnel_conversation LEFT JOIN prospect_details ON funnel_conversation.prospect_id = prospect_details.prospect_id WHERE funnel_conversation.user_id = ?',[id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

crudsObj.getFunnelConsById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM funnel_conversation WHERE funnel_id = ?',[id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};


crudsObj.updateFunnelCon = (id, prospect_id, msg, msg_date, msg_time, next_follow_up) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'UPDATE funnel_conversation SET  prospect_id = ?, msg = ?, msg_date = ?, msg_time = ?, next_follow_up = ? WHERE funnel_id = ?',
            [prospect_id, msg, msg_date, msg_time, next_follow_up, id],
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ status: '200', message: 'update successful' });
            }
        );
    });
};

crudsObj.deleteFunnelCon = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM funnel_conversation WHERE funnel_id = ?', [id], (err, results) => {
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