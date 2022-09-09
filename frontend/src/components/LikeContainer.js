import './LikeContainer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Container } from 'react-bootstrap';

const LikeContainer = ({photo, user, handleLike}) => {
  return (
    <Container>
      {photo.likes && user && (
       <Col className='like py-3' md={{ span: 6, offset: 3 }}>
          {photo.likes.includes(user._id) ? (
            <FontAwesomeIcon icon="fa-solid fa-heart" className="text-danger" />
          ) : (
            <FontAwesomeIcon icon="fa-regular fa-heart" onClick={() => handleLike(photo)} />
          )}
          <span> {photo.likes.length} like(s)</span>
        </Col>
        )}
    </Container>
  )
}

export default LikeContainer