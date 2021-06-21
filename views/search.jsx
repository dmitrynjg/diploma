const {
  Container,
  Card,
  Button,
  Pagination,
  Accordion,
  FormControl,
  Carousel,
  Image,
  Form,
} = require('react-bootstrap');
import axios from 'axios';
import 'bootstrap-css';
import { useState } from 'react';
import validator from 'validator';
import Header from './components/Header';
import ModalContainer from './components/ModalContainer';

const Search = ({ list = [], page, countPage, user }) => {
  const [quantity, setQuantity] = useState({});
  const [modalInfo, setShowModal] = useState({ status: false, type: 'payment', info: {}, title: 'Покупка тура' });
  const [tourList, setTourList] = useState(
    list.map((tour) => {
      return { ...tour, totalPrice: Number(tour.price) + Number(tour.ticketPrice) };
    })
  );
  return (
    <>
      <ModalContainer
        title={modalInfo.title}
        isShow={modalInfo.status}
        closeCb={() => setShowModal({ ...modalInfo, status: false })}
      >
        <Form>
          <Form.Group className='mb-3'>
            <Form.Label>Количество мест</Form.Label>
            <Form.Control
              type='number'
              placeholder='Количество мест'
              defaultValue={quantity[modalInfo.info.id]}
              onChange={(e) => setQuantity({ ...quantity, [modalInfo.info.id]: e.target.value })}
            />
          </Form.Group>
          <Button
            variant='primary'
            type='button'
            onClick={() => {
              axios
                .post('/api/buy/tour', {
                  id: modalInfo.info.id,
                  airId: modalInfo.info.airId,
                  quantity: quantity[modalInfo.info.id],
                })
                .then((res) => {
                  alert(res.data.message);
                  setShowModal({ ...modalInfo, status: false });
                })
                .catch((e) => alert(e.data.message));
            }}
          >
            {'Купить тур за ' + modalInfo.info.totalPrice * quantity[modalInfo.info.id] + ' RUB'}
          </Button>
        </Form>
      </ModalContainer>
      <Container>
        <Header user={user} />
        {tourList.length === 0 ? (
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
            {tourList.map((tour, index) => {
              return (
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
                              {tour.title} {tour.totalPrice} RUB
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
                                  onClick={async () => {
                                    const newTours = Array.from(tourList);
                                    const oldPrice = newTours[index].totalPrice;
                                    newTours[index].totalPrice = 'Загрузка...';
                                    newTours[index].price = 'Загрузка цены...';
                                    setTourList(newTours);
                                    await axios.get(`/api/get/tour?id=${tour.id}`).then((res) => {
                                      if (res.data.ok) {
                                        const tours = Array.from(tourList);
                                        tours[index].totalPrice = tour.ticketPrice + res.data.data.price;
                                        tours[index].price = res.data.data.price;
                                        setTourList(tours);
                                        setShowModal({ ...modalInfo, status: true, info: tour });
                                      }
                                    });
                                  }}
                                >
                                  {validator.isNumeric(String(tour.totalPrice))
                                    ? `Купить за ${(quantity[tour.id] ? quantity[tour.id] : 1) * tour.totalPrice} RUB`
                                    : tour.totalPrice}
                                </Button>
                              </div>
                            </div>
                            <p className='mt-3'>
                              <Carousel>
                                {tour.slides.map((slide) => {
                                  return (
                                    <Carousel.Item>
                                      <Image src={slide.image} fluid alt={slide.id} className='d-block w-100' />
                                    </Carousel.Item>
                                  );
                                })}
                              </Carousel>
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
              );
            })}
            <Pagination className='mt-2'>
              {page > 1 && (
                <Pagination.Prev
                  onClick={() => {
                    document.location.href = document.location.href.replace(`page=${page}`, `page=${page - 1}`);
                  }}
                />
              )}
              {page < countPage && (
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
              )}
            </Pagination>
          </>
        )}
      </Container>
    </>
  );
};

export default Search;
