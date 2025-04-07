import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ErrorMessage from '../../components/errormessage/errormessage';
import Loader from '../../components/loader/Loader';
import Paginate from '../../components/Paginate/Paginate';
import {
  listProducts,
  deleteProduct,
  createProduct,
} from '../../redux/reducers/product/product.actions';
import ProductActionTypes from '../../redux/reducers/product/product.types';
import Swal from 'sweetalert2';

const ProductsListPage = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();

  const productsList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productsList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch({ type: ProductActionTypes.PRODUCT_CREATE_RESET });

    if (!userInfo.isAdmin) {
      history.push('/login');
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts('', pageNumber));
    }
  }, [
    dispatch,
    history,
    pageNumber,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
  ]);

  const deleteHandler = (id) => {
    Swal.fire({
      title: 'Are you sure to delete this Product?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProduct(id));
        Swal.fire('Deleted!', 'Your Product has been deleted.', 'success');
      }
    });
  };

  const createProductHandler = () => {
    // Validate fields
    if (!name || !price || !image || !brand || !category || !countInStock || !description) {
      return Swal.fire('Error', 'All fields are required', 'error');
    }

    // Create a FormData object to handle file upload
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('brand', brand);
    formData.append('category', category);
    formData.append('countInStock', countInStock);
    formData.append('description', description);

    dispatch(createProduct(formData));

    setShowModal(false);
    setName('');
    setPrice('');
    setImage(null);
    setBrand('');
    setCategory('');
    setCountInStock('');
    setDescription('');
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
      <Row className='align-items-center' style={{ marginBottom: '20px' }}>
        <Col>
          <h1 style={{ color: 'white' }}>Products</h1>
        </Col>

        <Col className='text-right'>
    <LinkContainer to='/admin/product/create'>
    <Button className='my-3'>
      <i className='fas fa-plus'></i> Create Product
    </Button>
  </LinkContainer>
</Col>
      </Row>

      {loadingDelete && <Loader />}
      {errorDelete && (
        <ErrorMessage variant='danger'>{errorDelete}</ErrorMessage>
      )}
      {loadingCreate && <Loader />}
      {errorCreate && (
        <ErrorMessage variant='danger'>{errorCreate}</ErrorMessage>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage variant='danger'>{error}</ErrorMessage>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th style={{ color: 'white' }}>ID</th>
                <th style={{ color: 'white' }}>NAME</th>
                <th style={{ color: 'white' }}>PRICE</th>
                <th style={{ color: 'white' }}>CATEGORY</th>
                <th style={{ color: 'white' }}>BRAND</th>
                
                <th style={{ color: 'white' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} style={{ color: 'white' }}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}

      {/* Modal for creating a product */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='formProductName'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter product name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId='formProductPrice'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter product price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId='formProductImage'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='file'
                onChange={handleImageChange}
                accept='image/*'
                required
              />
            </Form.Group>
            <Form.Group controlId='formProductBrand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter product brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId='formProductCategory'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter product category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId='formProductCountInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter count in stock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId='formProductDescription'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter product description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant='primary' onClick={createProductHandler}>
            Create Product
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductsListPage;
