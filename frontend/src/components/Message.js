import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Message = ({ msg, type }) => {
  return (
    <Alert variant={type} className="mt-3">
        {type === 'success' ? (
          <>
            <FontAwesomeIcon icon="check" /> {msg}
          </>
        ) : (
          <>
            <FontAwesomeIcon icon="triangle-exclamation" /> {msg} 
          </>
        )}
    </Alert>
  )
}

export default Message;