import React from 'react'; 
import MembershipPaymentForm from '../../components/memFeeForm/membershipPaymentForm.component';
import MembershipExpiryForm from '../../components/memFeeForm/membershipExpiryForm.component';


const ProfilePage = () =>{
    return (
        <div>Profile page

            <MembershipExpiryForm />
            <MembershipPaymentForm />
        </div>
        
    )
}

export default ProfilePage;