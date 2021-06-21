import { Container, Button, FormControl, InputGroup } from 'react-bootstrap';
import 'bootstrap-css';
import './index.scss';
import { useState } from 'react';
import Header from './components/Header';

const Index = ({ user }) => {
  const [info, setInfo] = useState({
    from: '',
    to: '',
    dateStart: '',
    dateEnd: '',
  });
  return (
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
              className='w-100 input-date'
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
              className='w-100 input-date'
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
    </Container>
  );
};

export default Index;
