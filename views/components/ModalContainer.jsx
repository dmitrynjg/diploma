import { Modal } from 'react-bootstrap';

const ModalContainer = ({ children, title, isShow = false, closeCb }) => {
  return (
    <>
      {isShow && (
        <div
          style={{ height: '100vh', position: 'fixed', width: '100vw', zIndex: 4, background: '#00000091', top:0, left:0 }}
          className='position-fixed'
        >
          <Modal.Dialog>
            <Modal.Header
              closeButton
              onClick={() => {
                closeCb();
              }}
            >
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
          </Modal.Dialog>
        </div>
      )}
    </>
  );
};

export default ModalContainer;
