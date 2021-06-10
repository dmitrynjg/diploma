const { Container, Card, Button, Pagination, Modal } = require('react-bootstrap');
import 'bootstrap-css';
import { useState } from 'react';

const Search = ({ list = [], page }) => {
  const [tourId, setId] = useState(null);
  return (
    <Container>
      {list.length === 0 ? (
        <div style={{ height: '100vh' }} className='d-flex justify-content-center align-items-center'>
          <h1>
            Ничего не найдено{' '}
            <Button variant='dark' onClick={() => window.history.back()}>
              Назад
            </Button>
          </h1>
        </div>
      ) : (
        <>
          {list.map((tour) => (
            <>
              {tourId === tour.id && (
                <div className='d-flex justify-content align-items-center' style={{ height: '100vh' }}>
                  <Modal.Dialog>
                    <Modal.Header closeButton>
                      <Modal.Title>{tour.from + ' - ' + tour.to}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                      <p>Modal body text goes here.</p>
                    </Modal.Body>

                    <Modal.Footer>
                      <Button variant='secondary' onClick={() => setId(null)}>
                        Close
                      </Button>
                      <Button variant='primary'>Приобрести тур</Button>
                    </Modal.Footer>
                  </Modal.Dialog>
                </div>
              )}
              <Card border='primary'>
                <div className='d-inline-flex'>
                  <div className='w-25'>
                    <Card.Img variant='top' src={tour.poster} style={{ width: '100%' }} />
                    <Button variant='primary' className='w-100' onClick={() => setId(tour.id)}>
                      Купить
                    </Button>
                  </div>
                  <div className='content w-75 ml-2'>
                    <Card.Header className='d-flex'>
                      <Card.Title>
                        {tour.from} - {tour.to} {Number(tour.price) + Number(tour.ticketPrice)} RUB
                      </Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <div className='desc d-flex mt-3'>
                        <Card.Text className='w-50'>
                          <b>Стоимость тура:</b> {tour.price} RUB
                          <br />
                          <b>Стоимость билета:</b> {tour.ticketPrice} RUB
                          <br />
                          <b>Дата начала:</b> {tour.dateStart}
                          <br />
                          <b>Дата окончания:</b> {tour.dateEnd}
                          <br />
                        </Card.Text>
                        <Card.Text className='w-50'>
                          <b>Авиалиния:</b> {tour.airline}
                          <br />
                          <b>Количество мест в туре:</b> {tour.numberOfSeats}
                          <br />
                          <b>Свободных мест в туре:</b> {tour.freePlaces}
                          <br />
                          <b>Количество пересадок:</b> {tour.numberOfChanges}
                          <br />
                        </Card.Text>
                      </div>
                      <Card.Text>{tour.desc}</Card.Text>
                    </Card.Body>
                  </div>
                </div>
              </Card>
            </>
          ))}
          <Pagination className='mt-2'>
            {page > 1 && (
              <Pagination.Prev
                onClick={() => {
                  document.location.href = document.location.href.replace(`page=${page}`, `page=${page - 1}`);
                }}
              />
            )}
            <Pagination.Next
              onClick={() => {
                document.location.href = document.location.href.replace(`page=${page}`, `page=${Number(page) + 1}`);
              }}
            />
          </Pagination>
        </>
      )}

      {/* <Card style={{ width: '100%' }} className='d-flex'>
        <div className='w-25'></div>
        <Card.Body className='w-75'>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </Card.Text>
          <Button variant='primary'>Go somewhere</Button>
        </Card.Body>
      </Card> */}
    </Container>
  );
};

export default Search;
