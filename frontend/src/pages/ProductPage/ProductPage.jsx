import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from 'react-bootstrap';
import Rating from '../../components/rating/Rating.component';
import Loader from '../../components/loader/Loader';
import ErrorMessage from '../../components/errormessage/errormessage';
import { createProductReview } from '../../redux/reducers/product/product.actions';
import ProductActionTypes from '../../redux/reducers/product/product.types';
import { productDetails } from '../../redux/reducers/productdetails/productdetails.actions';
import Meta from '../../components/Meta/Meta';

const ShopPage = ({ history, match }) => {
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();

  const productDetail = useSelector((state) => state.productDetail);
  const { loading, error, product } = productDetail;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment('');
    }

    dispatch(productDetails(match.params.id));
    if (!product._id || product._id !== match.params.id) {
      dispatch({ type: ProductActionTypes.PRODUCT_CREATE_REVIEW_RESET });
    }
  }, [dispatch, match, successProductReview]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?quantity=${quantity}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (userInfo) {
      dispatch(createProductReview(match.params.id, {
        rating,
        comment,
        name: userInfo.name,
      }));
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage variant='danger'>{error}</ErrorMessage>
      ) : (
        <>
          <Meta title={product.name} />
          <Link className='btn btn-dark my-3' to='/'>
            Go Back
          </Link>
          <Row className='bg-dark'>
            <Col md={6} className='bg-dark rounded-lg'>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3} className='bg-dark rounded-lg'>
              <ListGroup variant='flush' className='bg-dark'>
                <ListGroup.Item className='bg-dark'>
                  <h3 style={{ color: 'white' }}>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item className='bg-dark' style={{ color: 'white' }}>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                    style={{ color: 'white' }}
                  />
                </ListGroup.Item>
                <ListGroup.Item className='bg-dark' style={{ color: 'white' }}>
                  Price: ${product.price}
                </ListGroup.Item>
                <ListGroup.Item className='bg-dark' style={{ color: 'white' }}>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3} className='bg-dark' style={{ color: 'white' }}>
              <Card className='bg-dark rounded'>
                <ListGroup variant='flush' className='bg-dark'>
                  <ListGroup.Item className='bg-dark'>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className='bg-dark'>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item className='bg-dark'>
                      <Row>
                        <Col>Quantity</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className='bg-dark text-white'
                          >
                            {[...Array(product.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item className='bg-dark' style={{ color: 'white' }}>
                    <Button
                      onClick={addToCartHandler}
                      className='btn-block'
                      type='button'
                      disabled={product.countInStock === 0}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={12} className='bg-dark' style={{ color: 'white' }}>
              <h2 style={{ color: 'white' }}>Reviews</h2>
              {product.reviews.length === 0 && <ErrorMessage>No Reviews</ErrorMessage>}
              <ListGroup variant='flush' className='bg-dark'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id} className='bg-dark rounded'>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item className='bg-dark rounded'>
                  <h2>Write a Customer Review</h2>
                  {successProductReview && (
                    <ErrorMessage variant='success'>
                      Review Submitted Successfully!
                    </ErrorMessage>
                  )}
                  {loadingProductReview && <Loader />}
                  {errorProductReview && (
                    <ErrorMessage variant='danger'>{errorProductReview}</ErrorMessage>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler} className='bg-dark'>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          className='bg-dark text-white'
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows='3'
                          value={comment}
                          name='write'
                          onChange={(e) => setComment(e.target.value)}
                          className='bg-dark text-white'
                          style={{ color: 'white' }}
                          placeholder='Write your comment here...'
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type='submit'
                        variant='primary'
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <ErrorMessage>
                      Please <Link to='/login'>Sign In</Link> to write a Review
                    </ErrorMessage>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ShopPage;
