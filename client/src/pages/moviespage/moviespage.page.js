import React, { useContext } from 'react'; 
// import PaymentForm from '../../components/paymentForm/paymentForm.component';
// import RegisteredPaymentForm from '../../components/paymentForm/registeredPaymentForm.component';
// import { MovieAPIContext } from '../../contexts/movie-api-provider';
import PaymentButtonForm from '../../components/paymentForm/paymentButtonForm.component';

const MoviesPage = () =>{

    // const { isLoggedIn } = useContext(MovieAPIContext);

    return (
        <div>

           <PaymentButtonForm />
            
            
        </div>
    )
}

export default MoviesPage;