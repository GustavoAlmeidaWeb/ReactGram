import { Container, Row, Spinner } from 'react-bootstrap';

const Loading = ({ loading }) => {
  return (
    <>
    {loading && (
        <Container className='my-5 text-center d-flex justify-content-center'>
            <Row>
                <Spinner animation="grow" variant="light" />
            </Row>
        </Container>
    )}
    </>
  )
}

export default Loading;