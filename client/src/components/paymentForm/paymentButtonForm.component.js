import React, { useContext } from 'react';
import PaymentForm from '../../components/paymentForm/paymentForm.component';
import RegisteredPaymentForm from '../../components/paymentForm/registeredPaymentForm.component';
import { MovieAPIContext } from '../../contexts/movie-api-provider';


export default function PaymentButton(props) {

    const { isLoggedIn } = useContext(MovieAPIContext);

    return(
        <div style={{marginTop: "10vh", marginLeft: "45vw"}}>
            {isLoggedIn ? (
                <RegisteredPaymentForm seat_id={props.seat_id}/>
            ) : ( 
                <PaymentForm seat_id={props.seat_id}/>
            )}
        </div>
        
    )
}