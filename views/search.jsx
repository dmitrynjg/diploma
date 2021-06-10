const { Container, Card, Button, Pagination, Accordion, FormControl } = require('react-bootstrap');
import axios from 'axios';
import 'bootstrap-css';
import { useState } from 'react';
import './search.scss';

const Search = ({ list = [], page }) => {
  const [quantity, setQuantity] = useState({});
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
              <Accordion defaultActiveKey='0'>
                <Card border='primary'>
                  <div className='d-flex w-sm-100'>
                    <div className='w-25 w-sm-100'>
                      <Card.Img variant='top' src={tour.poster} style={{ width: '100%' }} />
                      <Accordion.Toggle as={Button} eventKey={tour.id} className='w-100'>
                        Преобрести тур
                      </Accordion.Toggle>
                    </div>
                    <div className='content w-75 ml-2'>
                      <Card.Header className='d-flex'>
                        <Card.Title>
                          {tour.title} {Number(tour.price) + Number(tour.ticketPrice)} RUB
                        </Card.Title>
                      </Card.Header>
                      <Card.Body>
                        <div className='desc d-flex mt-3'>
                          <Card.Text className='w-50'>
                            <b>Откуда:</b> {tour.from} {tour.dateStart}
                            <br />
                            <b>Куда:</b> {tour.to} {tour.dateEnd}
                            <br />
                            <b>Стоимость тура:</b> {tour.price} RUB
                            <br />
                            <b>Стоимость билета:</b> {tour.ticketPrice} RUB
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
                      </Card.Body>
                    </div>
                  </div>
                  <Accordion.Collapse eventKey={tour.id}>
                    <Card.Body className='p-4'>
                      <Card.Text>
                        <div className='d-flex'>
                          <div className='w-50'>
                            <FormControl
                              placeholder='Количество билетов'
                              type='number'
                              onChange={(e) => {
                                setQuantity({ ...quantity, [tour.id]: e.target.value });
                              }}
                            />
                          </div>
                          <div className='w-50'>
                            <Button
                              variant='outline-primary'
                              className='w-100'
                              onClick={() => {
                                axios
                                  .post('/api/buy/tour', {
                                    id: tour.id,
                                    quantity: quantity[tour.id],
                                    airId: tour.airId,
                                  })
                                  .then((res) => alert(res.date.message));
                              }}
                            >
                              Купить за{' '}
                              {(quantity[tour.id] ? quantity[tour.id] : 1) *
                                (Number(tour.price) + Number(tour.ticketPrice))}{' '}
                              RUB
                            </Button>
                          </div>
                        </div>
                        <p className='mt-3'>
                          <b>Описание: </b>
                          {tour.desc}
                          <br />
                        </p>
                      </Card.Text>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
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
                let url = document.location.href;

                if (document.location.search.search('page') === -1) {
                  if (document.location.search === '') {
                    url += `?page=${page}`;
                  } else {
                    url += `&page=${page}`;
                  }
                }
                document.location.href = url.replace(`page=${page}`, `page=${Number(page) + 1}`);
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
