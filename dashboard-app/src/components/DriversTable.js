import React, { useState, useEffect } from 'react';
import { API_URL } from './config';
import SideBar from './SideBar';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { Col, Row, Container } from 'react-bootstrap';
import Navbar from './Navbar';

const APILINK = API_URL;

const DriversTable =  ({ driversData }) => {
    return (

<div className="dashboard">
       <Navbar/>
      <Container fluid>
        <Row>
          <Col md={9} className="order-2 order-md-1">
          <div style={{ display: 'flex' }}>
          </div>
          <div style={{ width: '950px', marginLeft: '30px', marginTop: '70px' }}>
            <h1>Driver Details</h1>
            <div className="col-xl-12">
              <div className="card">
                <h2 className="card-header">
                  Driver Details Table
                  <Link className="btn btn-primary btnAdd" style={{ float: "right", marginRight: "40px" }} to="/adddirectexpenses">Add Employee Detail</Link>
                </h2>
                <div className="card-body">
                  <div className="table-responsive" style={{ overflowY: 'auto', maxHeight: '400px', maxWidth: '1000px' }}>
                    <table className="table table-striped table-bordered first">
                      <thead>
                        <tr>
                          <th>driver_id</th>	
                          <th>ecnumber 	 	</th>	
                          <th>account_type 	</th>	
                          <th>signed_on 	 	</th>	
                          <th>username 		</th>	
                          <th>name 		</th>	
                          <th>surname 	 	</th>	
                          <th>idnumber 		</th>	
                          <th>sex 	 	</th>	
                          <th>dob 	</th>	
                          <th>address 	 	</th>	
                          <th>house_number_and_street_name</th>	 	 	
                          <th>surbub 	</th>	
                          <th>city 	 	</th>	
                          <th>country 	 	</th>	
                          <th>lat_cordinates 	 	</th>	
                          <th>long_cordinates 		</th>	
                          <th>phone 	</th>	
                          <th>plate</th>
                          <th>email 	</th>	
                          <th>password 		</th>	
                          <th>employer 		</th>	
                          <th>workindustry 	 	</th>	
                          <th>workaddress 	 	</th>	
                          <th>workphone 		</th>	
                          <th>workphone2 		</th>	
                          <th>nok1name 	 	</th>	
                          <th>nok1surname 		</th>	
                          <th>nok1relationship 		</th>	
                          <th>nok1phone 		</th>	
                          <th>nok2name 	</th>	
                          <th>nok2surname 	 	</th>	
                          <th>nok2relationship 		</th>	
                          <th>nok2phone 		</th>	
                          <th>rating 		</th>	
                          <th>credit_bar_rule_exception</th>	 		
                          <th>membershipstatus 	 	</th>	
                          <th>defaultsubs 		</th>	
                          <th>sendmail 		</th>	
                          <th>sendsms 		</th>	
                          <th>product_code </th>	
                          <th>cost_price 		</th>	
                          <th>selling_price 		</th>	
                          <th>payment_style 	</th>		
                          <th>profilePic </th>
                        </tr>
                      </thead>
                      <tbody>
                        {driversData.map((item) => (
                          <tr key={item.driver_id}>
                            <td>{item.driver_id}</td>
                            <td>{item.ecnumber}</td>
                            <td>{item.account_type}</td>
                            <td>{new Date(item.signed_on).toLocaleDateString()}</td>
                            <td>{item.username}</td>
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
                            <td>{item.plate}</td>
                            <td>{item.email}</td>
                            <td>{item.password}</td>
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
                            <td>{item.rating}</td>
                            <td>{item.credit_bar_rule_exception}</td>
                            <td>{item.membershipstatus}</td>
                            <td>{item.defaultsubs}</td>
                            <td>{item.sendmail}</td>
                            <td>{item.sendsms}</td>
                            <td>{item.product_code}</td>
                            <td>{item.cost_price}</td>
                            <td>{item.selling_price}</td>
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
          </div>
    
          {/* Scripts should not be included in React components */}
          {/* 
          <script src="../assets/vendor/jquery/jquery-3.3.1.min.js"></script>
          <script src="../assets/vendor/bootstrap/js/bootstrap.bundle.js"></script>
          <script src="../assets/vendor/slimscroll/jquery.slimscroll.js"></script>
          <script src="../assets/libs/js/main-js.js"></script> 
          */}
          </Col>
          <Col md={3} className="order-1 order-md-2">
            <SideBar />
          </Col>
          <Footer/>
        </Row>
      </Container>
    </div>
      );
};

export default DriversTable;