import { Card, Container, ListGroup } from 'react-bootstrap';
import Header from './components/Header';
import 'bootstrap-css';

const Profile = ({ orders = [], user }) => {
  return (
    <Container>
      <Header user={user} />
      <ListGroup as='ul' className='mb-4'>
        <ListGroup.Item as='li' active>
          <b>Информация о пользоватале</b>
        </ListGroup.Item>
        <ListGroup.Item as='li'>ID: {user.id}</ListGroup.Item>
        <ListGroup.Item as='li'>Имя: {user.name}</ListGroup.Item>
        <ListGroup.Item as='li'>Email: {user.email}</ListGroup.Item>
      </ListGroup>
      <div className='orders'>
        <h2>История покупок</h2>
        <div className='d-flex flex-wrap'>
          {orders.map((tour) => (
            <Card style={{ width: '33%' }}>
              <Card.Img variant='top' src={tour.poster} />
              <Card.Body className='m-3'>
                <Card.Title>{tour.title}</Card.Title>
                <Card.Text>
                  <div>
                    Отбытие из города {tour.from} {tour.dateStart}
                  </div>

                  <div>
                    Отбытие назад из города {tour.to} {tour.dateStart}
                  </div>
                  <div>Количество купленых мест в туре: {tour.quantity}</div>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Profile;
