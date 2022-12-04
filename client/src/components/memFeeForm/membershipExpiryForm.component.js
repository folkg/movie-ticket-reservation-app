import React, { useState, useContext, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { MovieAPIContext } from '../../contexts/movie-api-provider';

export default function MembershipExpiryForm(props) {

    let payment_happened = true;

    const { getUserInfo } = useContext(MovieAPIContext);
    const [ expirationDate, setExpirationDate ] = useState(null);
    const [ expired, setExpired ] = useState();

    useEffect(() => {
        async function getUserExpirationDate() {
            try{
                const userInfo = await getUserInfo();
                userInfo.annual_fee_expiry_date ? setExpirationDate(formatDate(userInfo.annual_fee_expiry_date)) : setExpirationDate("Not Available")
                const current_date = new Date();
                const expiry_date = new Date(userInfo.annual_fee_expiry_date);
                if (current_date > expiry_date) setExpired(true);
                
            } catch (e){
                console.log(e)
            }
        };
        getUserExpirationDate();
    },[payment_happened]);

    function formatDate(date_time){
        const date = new Date(date_time);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return [year, month, day].join('/');
    }



    return (
        <div>
            { expired ? (
                <Alert variant='danger'>
                    <Alert.Heading>Membership Fee is Expired!</Alert.Heading>
                    <p>
                        Renewal date was {expirationDate}
                    </p>
                </Alert> 
            ) : (
                <Alert variant='info'>
                        Renewal date was for membership fee is: <b>{expirationDate}</b>.
                </Alert> 
            )}
        </div>
    )
}