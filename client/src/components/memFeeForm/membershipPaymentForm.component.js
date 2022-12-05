import React, { useState, useContext, useEffect } from 'react';
import {Button, Modal, Form, Col, Row, Accordion, Alert} from 'react-bootstrap/';
import { MovieAPIContext } from '../../contexts/movie-api-provider';

export default function MembershipPaymentForm(props) {

    const { payMembershipFee } = useContext(MovieAPIContext);
    const [ showModal, setShow ] = useState(false);
    const [ fname, setFname ] = useState();
    const [ lname, setLname ] = useState();
    const [ cc_number, setCardNumber ] = useState();
    const [ paymentSuccess, setPaymentSuccess ] = useState(null)
    const [ paymentConfirmation, setPaymentConfirmation ] = useState(null);
    const [ payEnabled, setPayEnabled ] = useState(true);
    const [ useOther, setUseOtherCreditCard ] = useState(false);
    const [ expirationDate, setExpirationDate ] = useState(null);

    useEffect(() => {
        if(!useOther) setPayEnabled(true);
        else if(useOther && fname && lname && validateInputs())
            setPayEnabled(true);
        else {
            setPayEnabled(false);
        }
    });

    function validateInputs(){
        const reg1 = /^\d{16}$/i;
        if(reg1.test(cc_number)){
            return true;
        }
        return false;
    }

    const handleClose = () => {
        setShow(false);
        setFname("");
        setLname("");
        setCardNumber("");
        setPaymentSuccess(null);
        setPayEnabled(true);
        setPaymentConfirmation(null);
        props.helper(true);
    }

    const handleShow = () => setShow(true);

    const handleSubmit = async (event) => {
        try {
            const payment_result = await payMembershipFee(cc_number);
            if(payment_result[0] !== true) throw payment_result[1];
            setPaymentConfirmation(payment_result[1].payment_id);
            setExpirationDate(formatDate(payment_result[1].new_expiry_date));
            setPaymentSuccess(true);
        } catch (error) {
            setPaymentConfirmation(error);
            setPaymentSuccess(false);
        }
    }

    function formatDate(date_time){
        const date = new Date(date_time);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return [year, month, day].join('/');
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>Pay Membership Fee</Button>
            <Modal show={showModal} onHide={handleClose} >
                <Modal.Header>Payment</Modal.Header>
                <Modal.Body>
                    {paymentSuccess === true ? (
                        <Alert variant="success">
                            <Alert.Heading>Membership is Renewed!</Alert.Heading>
                                <p>
                                    You Membership is renewed until <b>{expirationDate}</b>.
                                </p>
                                    <hr />
                                <p>
                                    Here is your receipt#: <b>{paymentConfirmation}</b>. 
                                </p>
                                <hr />
                                <div className="d-flex justify-content-end">
                                    <Button onClick={handleClose} variant="outline-success">
                                        Return
                                    </Button>
                                </div>
                        </Alert>
                    ) : (paymentConfirmation && <Alert variant="danger">
                            <Alert.Heading>Processing Error</Alert.Heading>
                            <p>
                                {paymentConfirmation}
                            </p>
                            <div className="d-flex justify-content-end">
                                <Button onClick={handleClose} variant="outline-danger">
                                    Return
                                </Button>
                            </div>
                        </Alert>
                    )}
                    {paymentSuccess === true ? ( 
                        <div></div>
                     ) : (
                    <Accordion defaultActiveKey={['0']}>
                    <Accordion.Item eventkey="0">
                            <Alert variant="info">
                                <Alert.Heading>Checkout:</Alert.Heading>
                                    <p>
                                        Total Cost is: <b>$20</b>.
                                    </p>
                                    <hr />
                            </Alert>          
                        </Accordion.Item>
                        <Accordion.Item eventkey="1">
                                <Accordion.Header>Use Different Credit Card</Accordion.Header>
                                <Accordion.Body>
                                <Form.Check
                                    
                                    type='checkbox'
                                    label = 'Use Different Credit Card?'
                                    onChange={(e) => setUseOtherCreditCard(e.target.checked)}
                                    />
                                    <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Form.Group as={Col} className="mb-3" controlId="fname">
                                            <Form.Label>First Name:</Form.Label>
                                            <Form.Control 
                                                type="name" 
                                                placeholder="First Name" 
                                                value={fname || ""} 
                                                onChange={(e) => setFname(e.target.value)} 
                                                required>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group as={Col} className="mb-3" controlId="lname">
                                            <Form.Label>Last Name:</Form.Label>
                                            <Form.Control 
                                                type="name" 
                                                placeholder="Last Name" 
                                                value={lname || ""} 
                                                onChange={(e) => setLname(e.target.value)} 
                                                required>
                                            </Form.Control>
                                        </Form.Group>
                                    </Row>
                                    <Form.Group className="mb-3" controlId="credit_card_number">
                                        <Form.Label>Enter Credit Card Number:</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            pattern="^[0-9]+$" 
                                            placeholder="XXXX XXXX XXXX XXXX" 
                                            value={cc_number || ""} 
                                            onChange={(e) => setCardNumber(e.target.value)} 
                                            required>
                                        </Form.Control>
                                    </Form.Group> 
                                </Form>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                )}
                </Modal.Body>
                {paymentSuccess === true ? ( 
                        <div></div>
                     ) : (
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        type="reset" 
                        onClick={handleClose}>
                            Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        type="button" 
                        onClick={handleSubmit}
                        disabled={!payEnabled}>
                            Pay
                    </Button>
                </Modal.Footer>
            )}
            </Modal>
        </div>
    )

}