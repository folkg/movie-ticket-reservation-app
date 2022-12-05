import React from 'react'; 
import {BrowserRouter as Router, Link} from 'react-router-dom';


const HomePage = () =>{
    return (
        <div>
            <h1 style={{textAlign: "center"}}>Home page</h1>
            <Router>
            <div style={{textAlign: "center", justifyContent: "center"}} >
                <h4>Movies</h4>
                <Link to="/movies">
                <img
                    src="https://play-lh.googleusercontent.com/560-H8NVZRHk00g3RltRun4IGB-Ndl0I0iKy33D7EQ0cRRwH78-c46s90lZ1ho_F1so"
                    alt="example"
                />
                </Link>

                <br />
                <br />
                <Link to ="/cancel">
                <h4>Cancel a ticket</h4>
                </Link>
            </div>
            </Router>


        </div>
        
    )
}

export default HomePage;