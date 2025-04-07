import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Image, Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../redux/reducers/product/product.actions';
import Loader from '../../components/loader/Loader';
import ErrorMessage from '../../components/errormessage/errormessage';
import Swal from 'sweetalert2';
import Product from '../ProductEditPage/Product.svg';

const ProductCreatePage = ({ history }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, success } = productCreate;

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    const formData = new FormData(); // Create a new FormData object
    formData.append('image', file); // Append the file to the formData
  
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type to handle file uploads
        },
      };
  
      // Send the file to the backend and expect the file URL in response
      const { data } = await axios.post('/api/upload', formData, config);
  
      // Set the returned file URL in your component state (replace setImage logic as per your app)
      setImage(data.fileUrl); // Assuming the response contains the file URL as `fileUrl`
  
    } catch (error) {
      console.error('Error uploading image:', error); // Log any errors
    }
  };
  
  

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProduct({
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    );
  };

  if (success) {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Product Created Successfully!',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        history.push('/admin/productlist'); 
      });
  }

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-primary my-3'>
        Go Back
      </Link>
      <Container>
        <Row className='justify-content-md-center'>
          <Col xs={12} md={6} className='text-white'>
            <h1>Create Product</h1>
            {loading && <Loader />}
            {error && <ErrorMessage variant='danger'>{error}</ErrorMessage>}
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  value={name}
                  placeholder='Enter Product Name'
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId='price'>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type='number'
                  value={price}
                  placeholder='Enter Price'
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId='image'>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type='text'
                  value={image}
                  placeholder='Enter Image URL or Upload'
                  onChange={(e) => setImage(e.target.value)}
                />
                <Form.File
                  id='image-file'
                  label='Choose File'
                  custom
                  onChange={uploadFileHandler}
                />
                {uploading && <Loader />}
              </Form.Group>

              <Form.Group controlId='brand'>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type='text'
                  value={brand}
                  placeholder='Enter Brand'
                  onChange={(e) => setBrand(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId='countInStock'>
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control
                  type='number'
                  value={countInStock}
                  placeholder='Enter Count In Stock'
                  onChange={(e) => setCountInStock(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId='category'>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type='text'
                  value={category}
                  placeholder='Enter Category'
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId='description'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type='text'
                  value={description}
                  placeholder='Enter Description'
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Button type='submit' variant='primary'>
                Create Product
              </Button>
            </Form>
          </Col>
          <Col md={6}>
            <Image
              src={Product}
              alt='Product Logo'
              fluid
              style={{ border: 'none' }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductCreatePage;
