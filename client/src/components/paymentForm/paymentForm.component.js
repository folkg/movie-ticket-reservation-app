import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'; 
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { FormWrapper } from './paymentForm.styles';
import { MovieAPIContext } from '../../contexts/movie-api-provider';

const seat_id = "S_121022_9_002_004_22";

export default function PaymentForm() {

    const { getRefundByTicket, makePayment, processTicket } = useContext(MovieAPIContext);
    const [ showModal, setShow ] = useState(false);
    const [ fname, setFname ] = useState();
    const [ lname, setLname ] = useState();
    const [ cc_email, setEmail ] = useState();
    const [ cc_number, setCardNumber ] = useState();
    const [ ticket_id, setTicket ] = useState();
    const [ refund, setRefund ] = useState([]);
    const [ applyRefund, setApplyRefund ] = useState(false);
    const [ paymentSuccess, setPaymentSuccess ] = useState(null)
    const [ ticketConfirmation, setTicketConfirmation ] = useState(null);

    const handleClose = () => {
        setShow(false);
        setFname("");
        setLname("");
        setEmail("");
        setCardNumber("");
        setTicket("");
        setRefund([]);
        setApplyRefund(false);
        setPaymentSuccess(null);
        setTicketConfirmation(null);
    }
    const handleShow = () => setShow(true);

    const handleSubmit = async (event) => {
        try {
            const payment_result = await makePayment(seat_id, cc_number, ticket_id, applyRefund);
            if(payment_result[0] !== true) throw payment_result[1];
            const ticket_result = await processTicket(seat_id, cc_email, payment_result[1]);
            if(ticket_result[0] !== true) throw ticket_result[1];
            setTicketConfirmation(ticket_result[1]);
            setPaymentSuccess(true);
        } catch (error) {
            setTicketConfirmation(error);
            setPaymentSuccess(false);
        }
    }

    const handleRefund = async (e) => {
        console.log(ticket_id);
        const result = await getRefundByTicket(ticket_id);
        setRefund(result);
    }
    

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>Make Payment</Button>
            <Modal show={showModal} onHide={handleClose} >
                <Modal.Header>Payment</Modal.Header>
                <Modal.Body>
                    {paymentSuccess === true ? (
                        <Alert variant="success">
                            <Alert.Heading>Ticket Completed Successfully!</Alert.Heading>
                                <p>
                                    Here is your ticket id #: <b>{ticketConfirmation} </b>
                                    an email has been sent with your receipt and ticket confirmation.
                                </p>
                                <hr />
                                <div className="d-flex justify-content-end">
                                    <Button onClick={handleClose} variant="outline-success">
                                        Return
                                    </Button>
                                </div>
                        </Alert>
                    ) : (ticketConfirmation && <Alert variant="danger">
                            <Alert.Heading>Processing Error</Alert.Heading>
                            <p>
                                {ticketConfirmation}
                            </p>
                            <div className="d-flex justify-content-end">
                                <Button onClick={handleClose} variant="outline-danger">
                                    Return
                                </Button>
                            </div>
                        </Alert>
                    )}
                    <Accordion defaultActiveKey={['0']}>
                    <Accordion.Item eventkey="0">
                                <FormWrapper onSubmit={handleSubmit}>
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
                                <Form.Group className="mb-3" controlId="cc_email">
                                    <Form.Label>Enter Email:</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="email" 
                                        value={cc_email || ""} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required>
                                    </Form.Control>
                                </Form.Group>
                                
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
                                
                            </FormWrapper>
                        </Accordion.Item>
                        <Accordion.Item eventkey="1">
                            <Accordion.Header>Pay with Refund</Accordion.Header>
                            <Accordion.Body>
                                <FormWrapper >
                                    <Form.Group className="mb-3" controlId="refund_num">
                                        <Form.Label>Refund Ticket Number:</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            placeholder="Ticket Number Associated with Refund"
                                            value={ticket_id || ""}
                                            onChange={(e) => setTicket(e.target.value)}>
                                        </Form.Control>
                                        <div className="d-grid gap-2">
                                            <Button 
                                                variant="primary"
                                                size="sm"
                                                onClick={handleRefund}>
                                                    Get Refund
                                            </Button>
                                        </div>
                                        
                                        {refund[0]===true ? (
                                            <Alert variant="success">You have ${refund[1]} in credit
                                            <ToggleButton
                                                className="mb-2"
                                                id="toggle-check"
                                                type="checkbox"
                                                variant="outline-primary"
                                                checked={applyRefund}
                                                value="1"
                                                onChange={(e) => setApplyRefund(e.currentTarget.checked)}>
                                                    Click to Apply Credit
                                            </ToggleButton>
                                        </Alert>     
                                        ) : (refund[1] && <Alert variant="danger">{refund[1]}</Alert>)}
                                    </Form.Group>
                                </FormWrapper>
                            </Accordion.Body>
                        </Accordion.Item>
                        
                    </Accordion>
                </Modal.Body>
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
                        onClick={handleSubmit}>
                            Pay
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )



}