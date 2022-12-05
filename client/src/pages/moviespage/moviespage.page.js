
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form'

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
            {/* testing only  */}
            <Form>
            <Form.Group className="mb-3" controlId="cc_email">
                                        <Form.Label>Enter SEAT NUMBER TO TEST:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="enter text" 
                                            value={seatid || ""} 
                                            onChange={handleChange} 
                                            required>
                                        </Form.Control>
                                    </Form.Group>
            </Form>
            {/* end testing only */}

           <PaymentButtonForm seat_id={seatid}/>
            
            
        </div>
    )
}

export default MoviesPage;