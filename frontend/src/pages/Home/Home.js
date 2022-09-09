import './Home.css';

// Bootstrap and FontAwesome
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Components
import LikeContainer from '../../components/LikeContainer';
import PhotoItem from '../../components/PhotoItem';
import { Link } from 'react-router-dom';

// Hooks
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';

// Redux
import { getPhotos, like } from '../../slices/photoSlice';

const Home = () => {

  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);
  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  // Load all photos
  useEffect(() => {
    dispatch(getPhotos());
  }, [dispatch])

  // Like a photo
  const handleLike = (photo) => {
    dispatch(like(photo._id));
    resetMessage();
  }

  if(loading){
    return <p>Carregando...</p>
  }

  return (
    <Container id="home">
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          {photos && photos.map((photo) => (
            <div key={photo._id}>
              <PhotoItem photo={photo} handleLike={handleLike} />
              <LikeContainer photo={photo} user={user} handleLike={handleLike} />
              <div className="text-center mt-3">
                <Link to={`/photos/${photo._id}`} className="btn btn-dark"><FontAwesomeIcon icon="eye" /> Ver foto</Link>
              </div>
            </div>
          ))}
          {photos && photos.length === 0 && (
            <div className="no-photos text-center">
              <h2 className='my-3 h4'>
                <FontAwesomeIcon icon="face-frown" /> Ainda não há fotos publicadas <Link to={`/users/${user._id}`}>Clique Aqui</Link>
              </h2>
            </div>
          )}  
        </Col>
      </Row>
    </Container>
  )
}

export default Home;