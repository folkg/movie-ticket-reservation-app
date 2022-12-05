import React, { useState, useContext, useEffect } from 'react'; 
import MembershipPaymentForm from '../../components/memFeeForm/membershipPaymentForm.component';
import MembershipExpiryForm from '../../components/memFeeForm/membershipExpiryForm.component';
import ViewUserTickets from '../../components/ticket/viewUserTickets.component';
import {Card, Button, Accordion, ListGroup} from 'react-bootstrap';
import { MovieAPIContext } from '../../contexts/movie-api-provider';
// import { useHistory } from "react-router-dom";


export default function ProfileForm() {

    const { getUserInfo } = useContext(MovieAPIContext);
    const [ expirationDate, setExpirationDate ] = useState(null);
    const [ expired, setExpired ] = useState();
    const [ fname, setFName ] = useState();
    const [ lname, setLName ] = useState();
    const [ email, setEmail ] = useState();
    const [ address, setAddress ] = useState();
    const [ have_returned, setHaveReturned ] = useState();

    useEffect(() => {
        async function getUserExpirationDate() {
            try{
                const userInfo = await getUserInfo();
                userInfo.annual_fee_expiry_date ? setExpirationDate(formatDate(userInfo.annual_fee_expiry_date)) : setExpirationDate("Not Available")
                setFName(userInfo.first_name);
                setLName(userInfo.last_name);
                setEmail(userInfo.email_address);
                setAddress(userInfo.address);
                const current_date = new Date();
                const expiry_date = new Date(userInfo.annual_fee_expiry_date);
                if (current_date > expiry_date) setExpired(true);
                else setExpired(false);
                
            } catch (e){
                console.log(e)
            }
        };
        getUserExpirationDate();
        setHaveReturned(false);
    }, [have_returned]);

    // const history = useHistory();
    const home = () => {
        sessionStorage.clear();
    //     history.push("/");
    }

    return (
        <div  >
            <Card style={{width: "80%", margin: "auto"}}>
                <Card.Title>Your Profile!</Card.Title>
                <Card.Subtitle>Renewal Info:</Card.Subtitle>
                <Card.Text>
                    <MembershipExpiryForm expirationDate={expirationDate} expired = {expired} />
                    <MembershipPaymentForm helper={setHaveReturned} />
                </Card.Text>
                
                <Card.Subtitle>Personal Information</Card.Subtitle>
                <Card.Text>
                <ListGroup>
                    <ListGroup.Item>Name: {fname || " "} {lname || " "}</ListGroup.Item>
                    <ListGroup.Item>Email: {email || " "}</ListGroup.Item>
                    <ListGroup.Item>Address: {address || " "}</ListGroup.Item>
                </ListGroup>
                </Card.Text>
                <Accordion>
                    <Accordion.Item eventKey="0">
                    <Accordion.Header>Your Tickets:</Accordion.Header>
                    <Accordion.Body>
                        <ViewUserTickets />
                    </Accordion.Body>
                    </Accordion.Item>
                </Accordion> 
                <Button onClick={home} href="/">Logout</Button>
            </Card>
            
        </div>
    )

}

function formatDate(date_time){
    const date = new Date(date_time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day].join('/');
}