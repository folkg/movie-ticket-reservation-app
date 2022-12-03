import React, { useState, useContext } from 'react';
// import Button from 'react-bootstrap/Button';
import PaymentForm from '../../components/paymentForm/paymentForm.component';
import RegisteredPaymentForm from '../../components/paymentForm/registeredPaymentForm.component';
import { MovieAPIContext } from '../../contexts/movie-api-provider';

export default function PaymentButton() {

    const { isLoggedIn } = useContext(MovieAPIContext);

    // [paymentType, setPaymentType] = useState(null);

    // const handleShow = () =>{
    //     setPaymentType("user");
    // }

    return(
        <div>
            {isLoggedIn ? (
                <RegisteredPaymentForm />
            ) : ( 
                <PaymentForm />
            )}
        </div>
        
    )
}