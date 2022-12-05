import React from 'react';
import Alert from 'react-bootstrap/Alert';

export default function MembershipExpiryForm(props) {

    let expirationDate = props.expirationDate;
    let expired = props.expired;
    
    return (
        <div>
            { expired ? (
                <Alert variant='danger'>
                    <Alert.Heading>Membership Fee is Expired!</Alert.Heading>
                        Renewal date was {expirationDate}
                </Alert> 
            ) : (
                <Alert variant='info'>
                    Renewal date for membership fee is: <b>{expirationDate}</b>.
                </Alert> 
            )}
        </div>
    )
}