import './EditProfile.css';
import { useNavigate } from 'react-router-dom';

// Bootstrap
import { Container, Row, Col, Form, Button, FloatingLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Hooks
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Redux
import { profile, resetMessage, updateProfile, deleteUserProfile } from '../../slices/userSlice';
import { logout } from '../../slices/authSlice';

// Diretorio Imagens
import { upload } from '../../utils/config';

import Message from '../../components/Message';


const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, message, loading, error } = useSelector((state) => state.user);  

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  // Load user data
  useEffect(() => {
    dispatch(profile());
  },[dispatch]);

  // Fill form with user data
  useEffect(() => {

    if(user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio);
    }

  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gather user data from states
    const userData = {
      name
    }

    if(profileImage) {
      userData.profileImage = profileImage;
    }

    if(bio) {
      userData.bio = bio;
    }

    if(password) {
      userData.password = password;
    }

    // build from data
    
    const formData = new FormData()
    
    Object.keys(userData).forEach((key) => formData.append(key, userData[key]))
    
    await dispatch(updateProfile(formData));

    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000)
  }

  const handleFile = (e) => {
    // Image preview
    const image = e.target.files[0];
    
    setPreviewImage(image);
    setProfileImage(image);

  }

  const handleDeleteProfile = () => {

    dispatch(deleteUserProfile(dispatch));

    setTimeout(() => {
      dispatch(resetMessage());
      dispatch(logout());
      navigate('/');
    }, 2000)

  }

  return (
    <Container>
      <Row>
        <div className="text-center mb-4">
          <h2 className='display-4 mb-3'>Atualize seu perfil</h2>
          <p>Realize seu cadastro e começe a postar suas fotos...</p>
        </div>
        <Col md={{ span: 6, offset: 3 }}>
          <figure className='profile-image'>
            {(user.profileImage || previewImage) && (
              <img src={previewImage ? URL.createObjectURL(previewImage) : `${upload}/users/${user.profileImage}` } alt={user.name} />
            )}
          </figure>
          <Form onSubmit={handleSubmit} className="mb-3">
            <FloatingLabel label="Seu nome" className="mb-3 text-dark" >
              <Form.Control type="text" placeholder="Seu nome" onChange={(e) => setName(e.target.value)} value={name || ''} />
            </FloatingLabel>
            <FloatingLabel label="Seu e-mail" className="mb-3 text-dark" >
              <Form.Control type="email" placeholder="Seu e-mail" value={email || ''} disabled/>
            </FloatingLabel>
            <Form.Group className="mb-3">
              <Form.Label><FontAwesomeIcon icon="image-portrait" /> Imagem do Perfil</Form.Label>
              <Form.Control type="file" size="lg" onChange={handleFile}/>
            </Form.Group>
            <Form.Label><FontAwesomeIcon icon="file-signature" /> Bio</Form.Label>
            <FloatingLabel label="Fale um pouco sobre você" className="mb-3 text-dark" >
              <Form.Control type="text" placeholder="Fale um pouco sobre você" onChange={(e) => setBio(e.target.value)} value={bio || ''}  />
            </FloatingLabel>
            <Form.Label><FontAwesomeIcon icon="key" /> Deseja Alterar sua senha ?</Form.Label>
            <FloatingLabel label="Digite sua senha nova..." className="mb-3 text-dark" >
              <Form.Control type="password" placeholder="Digite sua senha nova..." onChange={(e) => setPassword(e.target.value)} />
            </FloatingLabel>
            <Form.Label className="d-grid">
              {!loading && <Button type="submit" size="lg" variant="primary"><FontAwesomeIcon icon="pen-to-square" /> Salvar</Button>}
              {loading && <Button type="submit" size="lg" variant="primary" disabled>Aguarde...</Button>}
            </Form.Label>
            <Form.Label className="d-grid">
              <Button variant="danger" onClick={handleDeleteProfile}><FontAwesomeIcon icon="trash-can" /> Excluir Conta</Button>
              {error && <Message msg={error} type='danger'/>}
              {message && <Message msg={message} type='success'/>}
            </Form.Label>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default EditProfile