import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer style={{ backgroundColor:'black',color: 'white' }}>
      <Container style={{ backgroundColor:'black',color: 'white' }}>
        <Row style={{ backgroundColor:'black',color: 'white' }}>
          <Col className='text-center py-3 text-dark'>Copyright &copy; DigiShop</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
