import { Container, Button, FormControl, InputGroup } from 'react-bootstrap';
import 'bootstrap-css';
import './index.scss';
import { useState } from 'react';
import Header from './components/Header';
import { Head } from '@react-ssr/express';
import TourList from './components/tourlist';

const Index = ({ user, list = [], page, countPage }) => {
  const [info, setInfo] = useState({
    from: '',
    to: '',
    dateStart: '',
    dateEnd: '',
  });
  return (
    <html lang='ru'>
      <Head>
        <title>Главная страница</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <body>
        <Container>
          <Header user={user} />
          {/*Поиск начало*/}
          <div className='row'>
            <div className='w-100 text-center p-4'>
              <h1>ПОИСК ТУРОВ</h1>
            </div>

            <div className='w-50'>
              <div className='input-group'>
                <span className='input-group-addon'>Когда лететь</span>
                <input
                  type='date'
                  className='w-100 input-date form-control'
                  onChange={(e) => {
                    setInfo({ ...info, dateStart: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className='w-50'>
              <div className='input-group'>
                <span className='input-group-addon'>Когда возвращаться</span>
                <input
                  type='date'
                  className='w-100 input-date form-control'
                  onChange={(e) => {
                    setInfo({ ...info, dateEnd: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className='w-33'>
              <InputGroup className='mb-3'>
                <FormControl
                  placeholder='Откуда'
                  aria-label='Откуда'
                  aria-describedby='basic-addon1'
                  onChange={(e) => {
                    setInfo({ ...info, from: e.target.value });
                  }}
                />
              </InputGroup>
            </div>
            <div className='w-33'>
              <InputGroup className='mb-3'>
                <FormControl
                  placeholder='Куда'
                  aria-label='Куда'
                  aria-describedby='basic-addon1'
                  onChange={(e) => {
                    setInfo({ ...info, to: e.target.value });
                  }}
                />
              </InputGroup>
            </div>
            <div className='w-33'>
              <Button
                variant='primary'
                className='w-100 ml-2'
                onClick={() => {
                  let url = '../../search?page=1&dateStart=';
                  url += `${info.dateStart}&dateEnd=${info.dateEnd}&from=${info.from}&to=${info.to}`;
                  document.location.href = url;
                }}
              >
                Найти
              </Button>
            </div>
          </div>
          {/*Поиск конец*/}
          <div className='content'>
            <h2>Список туров</h2>
            <TourList page={page} list={list} countPage={countPage}></TourList>
          </div>
        </Container>
      </body>
    </html>
  );
};

export default Index;
