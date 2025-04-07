import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from '../rating/Rating.component';

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded bg-dark'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' style={{ color: 'white' }}>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as='div' style={{ color: 'white' }}>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as='h3'style={{ color: 'white' }}>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
