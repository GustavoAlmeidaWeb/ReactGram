import './Auth.css';
import Message from '../../components/Message';

// Hooks
import { useState, useEffect } from 'react';

// Redux
import { register, reset } from '../../slices/authSlice';
import { useSelector, useDispatch } from 'react-redux';

// Link
import { Link } from 'react-router-dom';

// Bootstrap
import { Container, Row, Col, Form, FloatingLabel, Button } from 'react-bootstrap';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      name,
      email,
      password,
      confirmPassword,
    }

    console.log(user);
    dispatch(register(user));
  }

  // Clean all auth states
  useEffect(() => {

    dispatch(reset());

  }, [dispatch])

  return (
    <Container>
      <Row>
        <div className="text-center mb-4">
          <h2 className='display-4 mb-3'>Faça seu cadastro</h2>
          <p>Realize seu cadastro e comece a postar suas fotos...</p>
        </div>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit} className="mb-3">
            <FloatingLabel controlId="floatingInput" label="Seu nome" className="mb-3 text-dark" >
              <Form.Control type="text" placeholder="Seu nome" onChange={(e) => setName(e.target.value)} value={name || ''} />
            </FloatingLabel>
            <FloatingLabel controlId="floatingInput" label="Seu e-mail" className="mb-3 text-dark" >
              <Form.Control type="email" placeholder="Seu e-mail" onChange={(e) => setEmail(e.target.value)} value={email || ''} />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Senha" className="mb-3 text-dark" >
              <Form.Control type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} value={password || ''} />
            </FloatingLabel>
            <FloatingLabel controlId="floatingConfirmPassword" label="Confimar Senha" className="mb-3 text-dark" >
              <Form.Control type="password" placeholder="Confimar Senha" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword || ''} />
            </FloatingLabel>
            <Form.Label className="d-grid">
              {!loading && <Button type="submit" size="lg" variant="primary">Cadastrar</Button>}
              {loading && <Button type="submit" size="lg" variant="primary" disabled>Aguarde...</Button>}
              {error && <Message msg={error} type='danger'/>}
            </Form.Label>
          </Form>
          
          <p className="text-center">Já tem conta ?  <Link to="/login">Clique Aqui</Link></p>
        </Col>
      </Row>
    </Container>
  )
}

export default Register;