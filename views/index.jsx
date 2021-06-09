import axios from 'axios';
import 'bootstrap-css';
import { useState } from 'react';
import { Button, Col, Container, Form, Image } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import '../views/s.scss';

const Index = ({ list }) => {
  const [createTourData, setCreateTourData] = useState(false);
  const [tourList, setTourList] = useState(list);
  return (
    <Container fluid='md'>
      <div class='d-flex justify-content-start'>
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
        <div className='table-responsive'>
          <Table striped bordered hover variant='dark'>
            <thead>
              <tr>
                <th>#</th>
                <th>Фото</th>
                <th>Desc</th>
                <th>Цена</th>
                <th>Количество мест</th>
                <th>Откуда</th>
                <th>Куда</th>
                <th>Дата отбытия</th>
                <th>Дата прибытия</th>
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
                        const formData = new FormData();
                        const file = event.target.files[0];
                        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
                          return;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                          return;
                        }
                        const reader = new FileReader();
                        let fileData = { file: '', imagePreviewUrl: '' };
                        reader.onloadend = () => {
                          console.log(file)
                          fileData = {
                            file: file,
                            imagePreviewUrl: reader.result,
                          };
                          console.log(reader.result);
                          //console.log('file content', content);
                        };
                        reader.readAsDataURL(file);
                        console.log(fileData);
                        // axios
                        //   .post(`/api/upload/tour?id=${data.id.value}`, file, {
                        //     headers: {
                        //       'Content-Type': 'multipart/form-data',
                        //     },
                        //   })
                        //   .then((res) => alert(res.data.message));
                      }}
                    />
                    <label for={data.id.value + ' photo'}>
                      <Col>
                        <Image src={data.poster.value} height={'120px'} />
                      </Col>
                    </label>
                  </td>
                  {Object.keys(data).map(
                    (key) =>
                      ['id', 'poster'].indexOf(key) === -1 && (
                        <td>
                          <input
                            defaultValue={data[key].value}
                            type={data[key].type}
                            onChange={(event) => (data[key].value = event.target.value)}
                            onClick={() => {
                              if (data[key].type === 'button') {
                                if (typeof eval(data[key].callback) === 'function') {
                                  eval(data[key].callback)(data);
                                }
                              }
                            }}
                          />
                        </td>
                      )
                  )}
                  <td>
                    <Button
                      variant='outline-primary'
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
                      Изменить
                    </Button>
                    <Button
                      variant='danger'
                      onClick={() => {
                        axios.get(`/api/delete/tour?id=${data.id.value}`).then((res) => {
                          if (res.data.ok) {
                            setTourList(list.filter((tour) => Number(tour.id.value) !== Number(data.id.value)));
                          }
                          alert(res.data.message);
                        });
                      }}
                    >
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Container>
  );
};

export default Index;
