import { Col, Image, Nav } from 'react-bootstrap';

const Header = ({ user }) => {
  return (
    <div className='header mb-4 p-3 border border-primary' style={{ zIndex: 10 }}>
      <div className='link-list d-flex justify-content-end'>
        <Nav activeKey='/'>
          <Nav.Item>
            <Nav.Link href='/'>Поиск</Nav.Link>
          </Nav.Item>
          {user ? (
            <>
              <Nav.Item>
                <Nav.Link href='/admin/tours'>Админ панель</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href='/profile'>Профиль</Nav.Link>
              </Nav.Item>
              <Nav.Item className='d-flex justify-content-content align-items-center'>
                <Col>
                  <Image src={user.avatar} roundedCircle width={30} />
                </Col>
                <div>
                  <b>{user.name}</b>
                  <div>
                    <a href='/logout'>Выйти</a>
                  </div>
                </div>
              </Nav.Item>
            </>
          ) : (
            <>
              <Nav.Item>
                <Nav.Link href='/google'>Войти через Google</Nav.Link>
              </Nav.Item>
            </>
          )}
        </Nav>
      </div>
    </div>
  );
};

export default Header;
