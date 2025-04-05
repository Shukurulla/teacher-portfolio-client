import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FiX, FiDownload, FiFile } from "react-icons/fi";

const FileViewerComponent = ({ fileUrl, fileName, onClose }) => {
  return (
    <Modal
      show={true}
      onHide={onClose}
      size="xl"
      centered
      className="file-viewer-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <FiFile className="mr-2" />
          {fileName || "Fayl ko'ruvchi"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          height: "70vh",
          position: "relative",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <iframe
          src={`https://server.portfolio-sport.uz${fileUrl}`}
          className="w-full h-full"
          title="PDF Viewer"
        ></iframe>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          <FiX className="mr-2" />
          Yopish
        </Button>
        <Button
          variant="primary"
          href={`https://server.portfolio-sport.uz${fileUrl}`}
          download
        >
          <FiDownload className="mr-2" />
          Yuklab olish
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FileViewerComponent;
