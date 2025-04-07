import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Payment from './Payment.png';
import { savePaymentMethod } from '../../redux/reducers/cart/cart.actions';
import CheckoutSteps from '../../components/checkoutsteps/CheckoutSteps';


const PaymentPage = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress) {
    history.push('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));

    history.push('/placeorder');
    

  };

  return (
    <Container >
      <CheckoutSteps step1 step2 step3 />
      <Row className='justify-content-md-center'>
        <Col md={6}>
          <Image
            src={Payment}
            alt='Payment Logo'
            fluid
            style={{ border: 'none' }}
          />
        </Col>
        <Col xs={12} md={6} className=' bg-dark text-white'>
          <h1 className=' text-white'>Payment Method</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label as='legend' className=' bg-dark text-white'>Select Method</Form.Label>
              <Col>
                {/* <Form.Check
                  type='radio'
                  label='PayPal or Credit Card'
                  id='PayPal'
                  name='paymentMethod'
                  value='PayPal'
                  checked={paymentMethod === 'PayPal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                /> */}
                <Form.Check
                  type='radio'
                  label='Cash on Delivery'
                  id='Cash'
                  name='paymentMethod'
                  value='Cash'
                  checked={paymentMethod === 'Cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </Col>
            </Form.Group>
            <Button type='submit' variant='primary'>
              Continue
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;
