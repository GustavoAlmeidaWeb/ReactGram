import './Photo.css';

import { Form, FloatingLabel, Button } from 'react-bootstrap';

import { upload } from '../../utils/config';

// Components
import { Link, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import PhotoItem from '../../components/PhotoItem';

// Hooks
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';

// Redux
import { getPhoto, like, comment } from '../../slices/photoSlice';
import LikeContainer from '../../components/LikeContainer';

const Photo = () => {

  const { user } = useSelector((state) => state.auth);
  const { photo, loading, error, message } = useSelector((state) => state.photo);
  const { id } = useParams();
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);
  
  // Comments
  const [commentText, setCommentText] = useState('');


  // Load photo data
  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch,id])

  // Likes
  const handleLike = () => {
    dispatch(like(photo._id));
    resetMessage();
  }

  // Add Comment
  const handleComment = (e) => {
    e.preventDefault();

    const commentData = {
      comment: commentText,
      id: photo._id
    }

    dispatch(comment(commentData));
    setCommentText('');
    resetMessage();
  }

  // Loading
  if(loading) {
    return <p>Carregando...</p>;
  }

  // console.log(photo.comments.length);

  return (
    <>
      <PhotoItem photo={photo} handleLike={handleLike}/>
      <LikeContainer photo={photo} handleLike={handleLike} user={user} />
      <div className="col-md-6 offset-3">
        {error && <Message msg={error} type="danger"/>}
        {message && <Message msg={message} type="success"/>}
      </div>
      <div className="comments col-md-6 offset-3">
        <h3 className='my-3 h5'>Comentários: ({photo.comments && photo.comments.length})</h3>
        <Form onSubmit={handleComment}>
          <FloatingLabel controlId="floatingInput" label="Insira seu comentário..." className="mb-3 text-dark" >
            <Form.Control type="text" placeholder="Insira seu comentário..." onChange={(e) => setCommentText(e.target.value)} value={commentText || ''} />
          </FloatingLabel>
          <Form.Label className="d-grid">
            <Button type="submit" size="lg" variant="primary">Enviar</Button>
          </Form.Label>
        </Form>
        {photo.comments && photo.comments.length === 0 && <p className='my-3'>Nenhum comentário ainda...</p>}
        {photo.comments && photo.comments.map((comment) => (
          <div className="comment" key={comment.comment}>
            <div className="author mt-4">
              {comment.userImage && (
                <img src={`${upload}/users/${comment.userImage}`} alt={comment.userName} />
              )}
              <Link to={`/users/${comment.userId}`}>{comment.userName}</Link>
            </div>
            <p className='px-5'>{comment.comment}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default Photo