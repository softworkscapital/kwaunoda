import React, { useState, useEffect } from "react";
import { API_URL } from "./component/config";
import { Link } from "react-router-dom";
import SideBar from './component/SideBar';
import TopNav from './component/TopNav';
import Footer from './component/Footer';

const EmployeeDetails = () => {
  const [employeeDetails, setEmployeeDetails] = useState([]);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/hr_employees`);
        const data = await response.json();
        setEmployeeDetails(data);
      } catch (err) {
        console.error("Error fetching employee details:", err.message);
      }
    };

    fetchEmployeeDetails();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <TopNav />
        <SideBar />
      </div>
      <div style={{ width: '950px', marginLeft: '280px', marginTop: '25px' }}>
        <h1>Employee Details</h1>
        <div className="col-xl-12">
          <div className="card">
            <h2 className="card-header">
              Employee Details Table
              <Link className="btn btn-primary btnAdd" style={{ float: "right" }} to="/adddirectexpenses">Add Employee Detail</Link>
            </h2>
            <div className="card-body">
              <div className="table-responsive" style={{ overflowY: 'auto', maxHeight: '400px', maxWidth: '1000px' }}>
                <table className="table table-striped table-bordered first">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>EC Number</th>
                      <th>Account Type</th>
                      <th>Account Category</th>
                      <th style={{ width: '650px' }}>Signed On</th>
                      <th>Name</th>
                      <th>Surname</th>
                      <th>ID Number</th>
                      <th>Sex</th>
                      <th>Date of Birth</th>
                      <th>Address</th>
                      <th>House Number & Street Name</th>
                      <th>Suburb</th>
                      <th>City</th>
                      <th>Country</th>
                      <th>Latitude</th>
                      <th>Longitude</th>
                      <th>Phone</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Employer</th>
                      <th>Work Industry</th>
                      <th>Work Address</th>
                      <th>Work Phone 1</th>
                      <th>Work Phone 2</th>
                      <th>Next of Kin 1 Name</th>
                      <th>Next of Kin 1 Surname</th>
                      <th>Next of Kin 1 Relationship</th>
                      <th>Next of Kin 1 Phone</th>
                      <th>Next of Kin 2 Name</th>
                      <th>Next of Kin 2 Surname</th>
                      <th>Next of Kin 2 Relationship</th>
                      <th>Next of Kin 2 Phone</th>
                      <th>Credit Standing</th>
                      <th>Credit Bar Rule Exception</th>
                      <th>Membership Status</th>
                      <th>Default Subs</th>
                      <th>Send Mail</th>
                      <th>Send SMS</th>
                      <th>Product Code</th>
                      <th>Cost Price</th>
                      <th>Selling Price</th>
                      <th>Payment Style</th>
                      <th>BP Number</th>
                      <th>VAT Number</th>
                      <th>Profile Picture</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeDetails.map((item) => (
                      <tr key={item.hr_employee_id}>
                        <td>{item.hr_employee_id}</td>
                        <td>{item.ecnumber}</td>
                        <td>{item.account_type}</td>
                        <td>{item.account_category}</td>
                        <td>{new Date(item.signed_on).toLocaleDateString()}</td>
                        <td>{item.name}</td>
                        <td>{item.surname}</td>
                        <td>{item.idnumber}</td>
                        <td>{item.sex}</td>
                        <td>{item.dob}</td>
                        <td>{item.address}</td>
                        <td>{item.house_number_and_street_name}</td>
                        <td>{item.surbub}</td>
                        <td>{item.city}</td>
                        <td>{item.country}</td>
                        <td>{item.lat_cordinates}</td>
                        <td>{item.long_cordinates}</td>
                        <td>{item.phone}</td>
                        <td>{item.username}</td>
                        <td>{item.email}</td>
                        <td>{item.employer}</td>
                        <td>{item.workindustry}</td>
                        <td>{item.workaddress}</td>
                        <td>{item.workphone}</td>
                        <td>{item.workphone2}</td>
                        <td>{item.nok1name}</td>
                        <td>{item.nok1surname}</td>
                        <td>{item.nok1relationship}</td>
                        <td>{item.nok1phone}</td>
                        <td>{item.nok2name}</td>
                        <td>{item.nok2surname}</td>
                        <td>{item.nok2relationship}</td>
                        <td>{item.nok2phone}</td>
                        <td>{item.creditstanding}</td>
                        <td>{item.credit_bar_rule_exception}</td>
                        <td>{item.membershipstatus}</td>
                        <td>{item.defaultsubs}</td>
                        <td>{item.sendmail}</td>
                        <td>{item.sendsms}</td>
                        <td>{item.product_code}</td>
                        <td>{item.cost_price}</td>
                        <td>{item.selling_price}</td>
                        <td>{item.payment_style}</td>
                        <td>{item.bp_number}</td>
                        <td>{item.vat_number}</td>
                        <td>
                          <img src={item.profilePic} alt="Profile" style={{ width: '50px', height: '50px' }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Scripts should not be included in React components */}
      {/* 
      <script src="../assets/vendor/jquery/jquery-3.3.1.min.js"></script>
      <script src="../assets/vendor/bootstrap/js/bootstrap.bundle.js"></script>
      <script src="../assets/vendor/slimscroll/jquery.slimscroll.js"></script>
      <script src="../assets/libs/js/main-js.js"></script> 
      */}
    </div>
  );
};

export default EmployeeDetails;