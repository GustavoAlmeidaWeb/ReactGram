import './PhotoItem.css';

// Bootstrap and FontAwesome
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { upload } from '../utils/config';
import { Link } from 'react-router-dom';


const PhotoItem = ({ photo, handleLike }) => {
  return (
    <Container className='photo-item'>
        <Row>
            <Col md={{ span: 8, offset: 2 }} className="mt-5">
                {photo.image && (
                    <img src={`${upload}/photos/${photo.image}`} alt={photo.title} onDoubleClick={() => handleLike(photo)} />
                )}
                <h2 className='my-3'>{photo.title}</h2>
                <p><FontAwesomeIcon icon="user"/> Publicado por: <Link to={`/users/${photo.userId}`} >{photo.userName}</Link></p>
            </Col>
        </Row>
    </Container>
  )
}

export default PhotoItem