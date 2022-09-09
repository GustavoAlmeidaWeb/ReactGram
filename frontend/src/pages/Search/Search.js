import './Search.css';

// Bootstrap
import { Container, Row, Col } from 'react-bootstrap';

// Hooks
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';
import { useQuery } from '../../hooks/useQuery';

// Components
import LikeContainer from '../../components/LikeContainer';
import PhotoItem from '../../components/PhotoItem';
import { Link } from 'react-router-dom';

// Redux
import { searchPhotos, like } from '../../slices/photoSlice';

const Search = () => {
    const query = useQuery();
    const search = query.get('q');

    const dispatch = useDispatch();
    const resetMessage = useResetComponentMessage(dispatch);

    const { user } = useSelector((state) => state.auth);
    const { photos, loading }= useSelector((state) => state.photo);

    // Load Photos
    useEffect(() => {
        dispatch(searchPhotos(search))
    }, [dispatch, search])

    // Like a photo
    const handleLike = (photo) => {
        dispatch(like(photo._id));
        resetMessage();
    }

    if(loading){
        return <p>Carregando...</p>
    }

  return (
    <Container>
        <Row>
            <Col md={{ span: 8, offset: 2 }}>
                <h2>Você está buscando por: {search}</h2>
                {photos && photos.map((photo) => (
                    <div key={photo._id}>
                        <PhotoItem photo={photo} handleLike={handleLike} />
                        <LikeContainer photo={photo} user={user} handleLike={handleLike} />
                        <div className="text-center mt-3">
                            <Link to={`/photos/${photo._id}`} className="btn btn-dark">Ver foto</Link>
                        </div>
                    </div>
                ))}
                {photos && photos.length === 0 && (
                    <div className="no-photos">
                        <h2>Nenhum resultado encontrado para sua busca...</h2>
                    </div>
                )} 
            </Col>
        </Row>
    </Container>
  )
}

export default Search;