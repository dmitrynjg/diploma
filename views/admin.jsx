import axios from 'axios';
import 'bootstrap-css';
import { useState } from 'react';
import { Button, Col, Container, Form, Image, Modal } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Header from './components/Header';
import ModalContainer from './components/ModalContainer';

const getBase64Image = (file) =>
  new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      reject({ ok: false, message: 'файл не изображение' });
    }
    if (file.size > 5 * 1024 * 1024) {
      reject({ ok: false, message: 'Слишком большой файл' });
    }
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
// setShowModal({ ...modalInfo, status: false })
const Admin = ({ list, user }) => {
  const [createTourData, setCreateTourData] = useState(false);
  const [tourList, setTourList] = useState(list);
  const [modalInfo, setShowModal] = useState({ status: false, type: 'slides', info: {}, title: 'Модальное окно' });
  const [slides, setSlidesList] = useState([]);
  return (
    <>
      <ModalContainer
        title={modalInfo.title}
        isShow={modalInfo.status}
        closeCb={() => setShowModal({ ...modalInfo, status: false })}
      >
        {modalInfo.type === 'slides' && (
          <div className='d-flex flex-row' style={{ flexWrap: 'wrap' }}>
            {slides.map((slide) => (
              <div className='w-100 p-2'>
                <img src={slide.image} alt={slide.id} style={{ maxWidth: '200px' }} />
                <Button
                  variant='danger'
                  className='ml-4'
                  onClick={() => {
                    axios.get(`/api/delete/slide?id=${slide.id}`).then((res) => {
                      if (res.data.ok) {
                        setSlidesList(slides.filter((image) => Number(image.id !== slide.id)));
                      }
                      alert(res.data.message);
                    });
                  }}
                >
                  Удалить
                </Button>
              </div>
            ))}
            <input
              type='file'
              onChange={(event) => {
                getBase64Image(event.target.files[0])
                  .then(async (file) => {
                    await axios
                      .post('/api/upload/slide', {
                        id: modalInfo.info.id,
                        slide: file,
                      })
                      .then((res) => {
                        alert(res.data.message);
                      });
                  })
                  .catch((err) => alert(err.message));
              }}
            />
          </div>
        )}
        {modalInfo.type === 'create' && (
          <Form>
            <Form.Group className='mb-3'>
              <Form.Control
                type='number'
                placeholder='Количество мест'
                onChange={(e) => setCreateTourData({ ...createTourData, numberOfSeats: e.target.value })}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Control
                type='text'
                placeholder='Заголовок'
                onChange={(e) => setCreateTourData({ ...createTourData, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Control
                type='number'
                placeholder='Цена'
                onChange={(e) => setCreateTourData({ ...createTourData, price: e.target.value })}
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Control
                type='text'
                placeholder='Откуда'
                onChange={(e) => setCreateTourData({ ...createTourData, from: e.target.value })}
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Control
                type='text'
                placeholder='Куда'
                onChange={(e) => setCreateTourData({ ...createTourData, to: e.target.value })}
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Control
                type='text'
                as='textarea'
                rows={3}
                placeholder='Описание'
                onChange={(e) => setCreateTourData({ ...createTourData, desc: e.target.value })}
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Дата начала</Form.Label>
              <Form.Control
                type='date'
                placeholder='Дата начала'
                onChange={(e) => setCreateTourData({ ...createTourData, dateStart: e.target.value })}
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Дата окончание</Form.Label>
              <Form.Control
                type='date'
                placeholder='Дата окончания'
                onChange={(e) => setCreateTourData({ ...createTourData, dateEnd: e.target.value })}
              />
            </Form.Group>
            <Button
              variant='primary'
              type='button'
              onClick={() => {
                axios.post('/api/create/tour', createTourData).then((res) => alert(res.data.message));
              }}
            >
              Создать
            </Button>
          </Form>
        )}
      </ModalContainer>
      <Container fluid='md'>
        <Header user={user} />
        <div className='toolbar'>
          <div className='toolbar-item'>
            <Button
              variant='outline-primary'
              onClick={() => setShowModal({ status: true, type: 'create', info: {}, title: 'Создание тура' })}
            >
              Добавить тур
            </Button>
          </div>
        </div>
        <div class='d-flex justify-content-start'>
          <div className='table-responsive'>
            <Table striped bordered hover variant='dark'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Фото</th>
                  <th>Desc</th>
                  <th>Заголовок</th>
                  <th>Цена за тур</th>
                  <th>мест</th>
                  <th>Откуда</th>
                  <th>Куда</th>
                  <th>дата начала</th>
                  <th>дата</th>
                  <th>Осталось мест</th>
                </tr>
              </thead>
              <tbody>
                {tourList.map((data) => (
                  <tr>
                    <td>{data.id.value}</td>
                    <td>
                      <input
                        type='file'
                        id={data.id.value + ' photo'}
                        className='d-none'
                        onChange={(event) => {
                          getBase64Image(event.target.files[0])
                            .then((file) =>
                              axios.post('/api/upload/tour', { id: data.id.value, image: file }).then((res) => {
                                alert(res.data.message);
                              })
                            )
                            .catch((err) => alert(err.message));
                        }}
                      />
                      <label for={data.id.value + ' photo'}>
                        <Col>
                          <Image src={data.poster.value} height={'90px'} />
                        </Col>
                      </label>
                    </td>
                    <td>
                      <Form.Control
                        type='text'
                        as='textarea'
                        style={{ width: '270px' }}
                        rows={3}
                        placeholder='Описание'
                        defaultValue={data.desc.value}
                        onChange={(event) => (data['desc'].value = event.target.value)}
                      />
                      {/* <textarea onChange={(event) => (data['desc'].value = event.target.value)}>
                      {data['desc'].value}
                    </textarea> */}
                    </td>
                    {Object.keys(data).map(
                      (key) =>
                        ['id', 'poster', 'desc'].indexOf(key) === -1 && (
                          <td>
                            <Form.Control
                              defaultValue={data[key].value}
                              type={data[key].type}
                              onChange={(event) => (data[key].value = event.target.value)}
                            />
                          </td>
                        )
                    )}
                    <td style={{ width: '150px' }}>
                      <Button
                        variant='outline-primary'
                        className='w-100'
                        onClick={() => {
                          const editData = {};
                          editData.id = data.id.value;
                          Object.keys(data).forEach((key) => {
                            if (data[key].value !== data[key].default) {
                              editData[key] = data[key].value;
                              data[key].default = data[key].value;
                            }
                          });
                          axios.post('/api/update/tour', editData).then((res) => {
                            alert(res.data.message);
                          });
                        }}
                      >
                        ✏️ Изменить
                      </Button>
                      <Button
                        className='w-100'
                        onClick={() => {
                          axios.post(`/api/get/slides`, { tourIdList: [data.id.value] }).then((res) => {
                            if (res.data.ok) {
                              setShowModal({
                                status: true,
                                type: 'slides',
                                info: { id: Number(data.id.value) },
                                title: 'Список слайдев',
                              });
                              setSlidesList(res.data.list);
                            }
                          });
                        }}
                      >
                        🖼️ Изменить слайды
                      </Button>
                      <Button
                        variant='danger'
                        className='w-100'
                        onClick={() => {
                          axios.get(`/api/delete/tour?id=${data.id.value}`).then((res) => {
                            if (res.data.ok) {
                              setTourList(list.filter((tour) => Number(tour.id.value) !== Number(data.id.value)));
                            }
                            alert(res.data.message);
                          });
                        }}
                      >
                        ❌ Удалить
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Admin;
