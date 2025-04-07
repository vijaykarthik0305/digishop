import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
  cancelOrder,
} from '../../redux/reducers/order/order.actions';
import { ListGroup, Card, Row, Col, Image, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/errormessage/errormessage';
import Loader from '../../components/loader/Loader';
import { OrderActionTypes } from '../../redux/reducers/order/order.types';
import Swal from 'sweetalert2';

const OrderPage = ({ history, match }) => {
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderCancel = useSelector((state) => state.orderCancel || {});
  const { success: successCancel } = orderCancel;

  // Calculate price if order is loaded
  if (!loading && order) {
    const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
    order.shippingPrice = addDecimals(0); // Adjust shipping price as needed
    order.taxPrice = addDecimals(0); // Adjust tax price as needed
    order.totalPrice = addDecimals(
      Number(order.itemsPrice) + Number(order.shippingPrice) + Number(order.taxPrice)
    );
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }

    if (
      !order ||
      successPay ||
      successDeliver ||
      successCancel ||
      order._id !== orderId
    ) {
      dispatch({ type: OrderActionTypes.ORDER_PAY_RESET });
      dispatch({ type: OrderActionTypes.ORDER_DELIVER_RESET });
      dispatch({ type: OrderActionTypes.ORDER_CANCEL_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, successPay, successDeliver, successCancel, history, userInfo, order]);

  const successPaymentHandler = () => {
    dispatch(payOrder(orderId, { id: 'cash-on-delivery' }));
    Swal.fire({
      icon: 'success',
      title: 'Payment Successful',
      text: 'The order has been marked as paid!',
    });
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(orderId));
    Swal.fire({
      icon: 'success',
      title: 'Order Delivered',
      text: 'The order has been marked as delivered!',
    });
  };

  const cancelOrderHandler = () => {
    dispatch(cancelOrder(orderId));
    Swal.fire({
      icon: 'info',
      title: 'Order Cancelled',
      text: 'The order has been cancelled!',
    });
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <div className=" text-white min-vh-100">
      <Link to='/admin/orderlist' className='btn btn-dark my-3'>
        Go Back
      </Link>
      <h1 className=" text-white" >Order {order._id}</h1>
      <Row className="bg-dark text-white">
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item className="bg-dark text-white">
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`} className=" text-white">{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>Delivered on {order.deliveredAt}</Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item className="bg-dark text-white">
              <h2>Payment Method</h2>
              <p>
                <strong>Method:</strong> Cash on Delivery
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white">
              <h2>Ordered Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order Is Empty!</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index} className="bg-dark text-white">
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`} className="text-white">
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.quantity} x ${item.price} = ${item.quantity * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card className="bg-dark text-white">
            <ListGroup variant='flush'>
              <ListGroup.Item className="bg-dark text-white">
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-white">
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-white">
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-white">
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-white">
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {userInfo && order.isPaid && !order.isDelivered && (
                <ListGroup.Item className="bg-dark text-white">
                  <Button
                    type='button'
                    className='btn btn-block btn-light'
                    onClick={deliverHandler}
                  >
                    Mark As Delivered!
                  </Button>
                </ListGroup.Item>
              )}
              {userInfo && !order.isCancelled && !order.isDelivered && (
                <ListGroup.Item className="bg-dark text-white">
                  <Button
                    type='button'
                    className='btn btn-danger btn-block'
                    onClick={cancelOrderHandler}
                  >
                    Cancel Order
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderPage;
