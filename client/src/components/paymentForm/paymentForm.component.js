import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'; 
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FormWrapper } from './paymentForm.styles';




export default function PaymentForm() {

    // const [ show, setShow ] = useState(false);
    const [ show, setShow ] = useState(true);
    const [fname, setFname] = useState(""), changeFname = ({target:{value}}) => setFname(value);
    const [lname, setLname] = useState(""), changeLname = ({target:{value}}) => setLname(value);
    const [cc_email, setEmail] = useState(""), changeEmail = ({target:{value}}) => setEmail(value);
    const [cc_number, setCardNumber] = useState(""), changeNumber = ({target:{value}}) => setCardNumber(value);
        

    const handleClose = () => setShow(true);
    const handleShow = () => setShow(true);

    const handleSubmit = (event) => {
        console.log(fname);
        console.log(lname);
        console.log(cc_email);
        console.log(cc_number);
        console.log(formDataObj);
        alert(formDataObj);
    }
    

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>Make Payment</Button>
            <Modal show={show} onHide={handleClose} >
                <Modal.Header>Payment</Modal.Header>
                <Modal.Body>
                    <FormWrapper onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group as={Col} className="mb-3" controlId="fname">
                                <Form.Label>First Name:</Form.Label>
                                <Form.Control type="name" placeholder="First Name" value={fname} onChange={changeFname} required></Form.Control>
                            </Form.Group>
                            <Form.Group as={Col} className="mb-3" controlId="lname">
                                <Form.Label>Last Name:</Form.Label>
                                <Form.Control type="name" placeholder="Last Name" value={lname} onChange={changeLname} required></Form.Control>
                            </Form.Group>
                        </Row>
                        <Form.Group className="mb-3" controlId="cc_email">
                            <Form.Label>Enter Email:</Form.Label>
                            <Form.Control type="email" placeholder="email" value={cc_email} onChange={changeEmail} required></Form.Control>
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="credit_card_number">
                            <Form.Label>Enter Credit Card Number:</Form.Label>
                            <Form.Control type="text" pattern="^[0-9]+$" placeholder="XXXX XXXX XXXX XXXX" value={cc_number} onChange={changeNumber} required></Form.Control>
                        </Form.Group>
                        <Button variant="secondary" type="reset" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Pay
                        </Button>
                    </FormWrapper>
                </Modal.Body>
            </Modal>
        </div>
    )



}