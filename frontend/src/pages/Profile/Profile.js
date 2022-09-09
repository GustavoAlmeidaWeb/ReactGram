import './Profile.css';

// Bootstrap and FontAwesome
import { Container, Row, Col, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Router Dom
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Hooks
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { upload } from '../../utils/config';
import Message from '../../components/Message';

// Redux
import { getUserDetails } from '../../slices/userSlice';
import { publishPhoto, resetMessage, getUserPhotos, deletePhoto, updatePhoto } from '../../slices/photoSlice';


const Profile = () => {

    const {id} = useParams();
    const dispatch = useDispatch();
    const {user, loading} = useSelector((state) => state.user);
    const {user: userAuth} = useSelector((state) => state.auth);
    const { photos, loading: loadingPhoto, error: errorPhoto, message: messagePhoto } = useSelector((state) => state.photo);

    // create photo states
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');

    // update photo state
    const [editId, setEditId] = useState('');
    const [editImage, setEditImage] = useState('');
    const [editTitle, setEditTitle] = useState('');

    // Photo
    const newPhotoForm = useRef();
    const editPhotoForm = useRef();

    // Load user data
    useEffect(() => {

        dispatch(getUserDetails(id));
        dispatch(getUserPhotos(id));

    }, [dispatch, id]);

    const handleFile = (e) => {
        // Image preview
        const image = e.target.files[0];
        
        setImage(image);
    
    };

    const resetMessageComponent = () => {

        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);

    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const photoData = {
            title,
            image
        }

        // Build Form Data
        const formData = new FormData();
        const photoFormData = Object.keys(photoData).forEach((key) => formData.append(key, photoData[key]));
        
        formData.append('photo', photoFormData);

        dispatch(publishPhoto(formData));

        setTitle('');
        setImage('');

        resetMessageComponent();

    };

    // Show or Hide Forms
    const showOrHide = () => {
        newPhotoForm.current.classList.toggle('hide');
        editPhotoForm.current.classList.toggle('hide');
    }

    // Delete a photo
    const handleDelete = (id) => {
        
        dispatch(deletePhoto(id));

        resetMessageComponent();

    }

    // Update a photo
    const handleUpdate = (e) => {
        e.preventDefault();

        const photoData = {
            title: editTitle,
            id: editId,
        }

        dispatch(updatePhoto(photoData));

        resetMessageComponent();
    }

    // Open edit form
    const handleEdit = (photo) => {

        if(editPhotoForm.current.classList.contains('hide')){
            showOrHide();
        }

        setEditId(photo._id);
        setEditTitle(photo.title);
        setEditImage(photo.image);
    }

    // Cancel Update a photo
    const handleCancelEdit = () => {
        showOrHide();
    }

    if(loading){
        return <p>Carregando...</p>
    };

  return (
    <Container>
        <Row className='profile-info'>
            <Col lg={5} className='img-detail'>
                {user.profileImage && (
                    <img src={`${upload}/users/${user.profileImage}`} alt={user.name} />
                )}
            </Col>
            <Col lg={7} className='name-bio-detail'>
                {user && (
                    <>
                        <h2 className='display-6'>{user.name}</h2>
                        <p>{user.bio}</p>
                    </>
                )}
            </Col>
        </Row>
        <Row>
            {id === userAuth._id && (
                <>
                    <Col md={{ span: 6, offset: 3 }} ref={newPhotoForm} className='my-5'>
                        <p className='display-6 text-center'>Compartilhe algo com seus amigos...</p>
                        <Form onSubmit={handleSubmit} className="mb-3">
                            <Form.Group className="mb-3" >
                                <Form.Label>Título</Form.Label>
                                <Form.Control type="text" placeholder="Insira um título" onChange={(e) => setTitle(e.target.value)} value={title || ''}/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Imagem do Perfil</Form.Label>
                                <Form.Control type="file" size="lg" onChange={handleFile}/>
                            </Form.Group>
                            <Form.Label className="d-grid">
                                {!loadingPhoto && <Button type="submit" size="lg" variant="primary">Postar</Button>}
                                {loadingPhoto && <Button type="submit" size="lg" variant="primary" disabled>Aguarde...</Button>}
                                {errorPhoto && <Message msg={errorPhoto} type='danger'/>}
                                {messagePhoto && <Message msg={messagePhoto} type='success'/>}
                            </Form.Label>
                        </Form>
                    </Col>
                    <Col md={{ span: 6, offset: 3 }} ref={editPhotoForm} className='my-5 hide photo-edit'>
                        <p className='display-6 text-center'>Editando a foto...</p>
                        {editImage && (
                            <img className="mb-3" src={`${upload}/photos/${editImage}`} alt={editTitle} />
                        )}
                        <Form onSubmit={handleUpdate} className="mb-3">
                            <Form.Group className="mb-3" >
                                <Form.Control type="text" placeholder="Editar o título" onChange={(e) => setEditTitle(e.target.value)} value={editTitle || ''}/>
                            </Form.Group>
                            <Form.Label className="d-grid">
                                <Button type="submit" size="lg" variant="primary">Atualizar</Button>
                                <Button size="lg" variant="warning" className='my-3' onClick={handleCancelEdit}>Cancelar Edição</Button>
                                {errorPhoto && <Message msg={errorPhoto} type='danger'/>}
                                {messagePhoto && <Message msg={messagePhoto} type='success'/>}
                            </Form.Label>
                        </Form>

                    </Col>
                </>
            )}
        </Row>
        <Row>
            <>
                {photos && <p className='display-6 text-center my-3'>Fotos Publicadas</p>}
                {photos.length === 0 && <p className='display-6 text-center my-3'>Não há fotos Publicadas...</p>}
                <Col md={{ span: 8, offset: 2 }} className='container-photos'>
                    {photos && photos.map((photo) => (
                        <>
                            <div className="photo text-center" key={photo._id}>
                                {photo.image && (
                                    <Link to={`/photos/${photo._id}`}>
                                        <img src={`${upload}/photos/${photo.image}`} alt={photo.title} />
                                    </Link>
                                )}
                                {id === userAuth._id ? (
                                    <div className="actions">
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bottom">Ver foto</Tooltip>}>
                                            <Link to={`/photos/${photo._id}`} className='btn btn-dark text-white'>
                                                <FontAwesomeIcon icon="eye"/>
                                            </Link>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bottom">Editar foto</Tooltip>}>
                                            <Button className='btn btn-dark text-white' onClick={() => handleEdit(photo)}>
                                                <FontAwesomeIcon icon="pencil" />
                                            </Button>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bottom">Excluir foto</Tooltip>}>
                                            <Button className='btn btn-dark text-white' onClick={() => handleDelete(photo._id)}>
                                                <FontAwesomeIcon icon="xmark" />
                                            </Button>
                                        </OverlayTrigger>
                                    </div>
                                ) : (
                                    <Link to={`/photos/${photo._id}`} className="btn btn-dark my-2">Ver</Link>
                                )}
                            </div>
                        </>
                    ))}
                </Col>
            </>
        </Row>
    </Container>
  )
}

export default Profile