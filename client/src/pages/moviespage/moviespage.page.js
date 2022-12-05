import SelectMovieForm from '../../components/selectMovieForm/selectMovieForm.component';

import React, { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form'
// import PaymentForm from '../../components/paymentForm/paymentForm.component';
// import RegisteredPaymentForm from '../../components/paymentForm/registeredPaymentForm.component';
// import { MovieAPIContext } from '../../contexts/movie-api-provider';
import PaymentButtonForm from '../../components/paymentForm/paymentButtonForm.component';

const MoviesPage = () =>{


    return (
        <div>
            <SelectMovieForm/>

        </div>
    )
}

export default MoviesPage;