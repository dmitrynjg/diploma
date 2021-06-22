import { Head } from '@react-ssr/express';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import TourList from './components/tourlist';
import 'bootstrap-css';

const Search = ({ list = [], page, countPage, user }) => {
  return (
    <html lang='ru'>
      <Head>
        <title>{`Поиск билетов ` + page + ` страница`}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
      <body>
        <Container>
          <Header user={user} />
          <TourList page={page} list={list} countPage={countPage}></TourList>
        </Container>
      </body>
    </html>
  );
};

export default Search;
