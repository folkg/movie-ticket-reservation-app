
import React, { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form'
// import PaymentForm from '../../components/paymentForm/paymentForm.component';
// import RegisteredPaymentForm from '../../components/paymentForm/registeredPaymentForm.component';
// import { MovieAPIContext } from '../../contexts/movie-api-provider';
import PaymentButtonForm from '../../components/paymentForm/paymentButtonForm.component';

const MoviesPage = () =>{

    // const { isLoggedIn } = useContext(MovieAPIContext);
    const [seatid, setSeatId] = useState();

    const handleChange = (e) => {
        console.log(e.target.value);
        setSeatId(e.target.value);
        console.log(seatid);
    }

    return (
        <div>
            <Form>
            <Form.Group className="mb-3" controlId="cc_email">
                                        <Form.Label>Enter Email:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="enter text" 
                                            value={seatid || ""} 
                                            onChange={handleChange} 
                                            required>
                                        </Form.Control>
                                    </Form.Group>
            </Form>

           <PaymentButtonForm seat_id={seatid}/>
            
            
        </div>
    )
}

export default MoviesPage;