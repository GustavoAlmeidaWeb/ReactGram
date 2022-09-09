import './Auth.css';

// Bootstrap
import { Container, Row, Col, Form, Button, FloatingLabel } from 'react-bootstrap';

import { Link } from 'react-router-dom';

// Components
import Message from '../../components/Message';

// Hooks
import { useEffect, useState } from 'react';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../../slices/authSlice';



const Login = () => {

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = { 
      email,
      password
    }

    dispatch(login(user));
  }

  // clean all states
  useEffect(() => {

    dispatch(reset());

  }, [dispatch])

  return (
    <Container>
      <Row>
        <div className="text-center mb-4">
          <h2 className='display-4 mb-3'>Faça seu Login</h2>
          <p>Faça seu login e comece a postar suas fotos...</p>
        </div>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit} className="mb-3">
            <FloatingLabel controlId="floatingInput" label="Seu e-mail" className="mb-3 text-dark" >
              <Form.Control type="email" placeholder="Seu e-mail" onChange={(e) => setEmail(e.target.value)} value={email || ''} />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Senha" className="mb-3 text-dark" >
              <Form.Control type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} value={password || ''} />
            </FloatingLabel>
            <Form.Label className="d-grid">
              {!loading && <Button type="submit" size="lg" variant="primary">Entrar</Button>}
              {loading && <Button type="submit" size="lg" variant="primary" disabled>Aguarde...</Button>}
              {error && <Message msg={error} type='danger'/>}
            </Form.Label>
          </Form>
          
          <p className="text-center">Não criou sua conta ainda ? <Link to="/register">Clique Aqui</Link></p>
        </Col>
      </Row>
    </Container>
  )
}

export default Login