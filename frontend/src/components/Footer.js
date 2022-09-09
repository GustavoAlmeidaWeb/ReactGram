import './Footer.css';
import { Container, Row } from 'react-bootstrap';

const Footer = () => {
  return (
    <Row className='bg-dark footer'>
      <Container fluid>
        <p>ReactGram &copy; 2022</p>
      </Container>
    </Row>
  )
}

export default Footer;