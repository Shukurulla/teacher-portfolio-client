import React from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { FiX, FiDownload, FiFile } from "react-icons/fi";

const getFileExtension = (fileName) => {
  return fileName?.split(".").pop().toLowerCase();
};

const FileViewerComponent = ({ fileUrl, fileName, onClose }) => {
  const fileExtension = getFileExtension(fileName);
  const fullUrl = `https://server.portfolio-sport.uz${fileUrl}`;

  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension);
  const isPDF = fileExtension === "pdf";
  const isUnsupported = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(
    fileExtension
  );

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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isImage ? (
          <img
            src={fullUrl}
            alt={fileName}
            style={{ maxHeight: "100%", maxWidth: "100%" }}
          />
        ) : isPDF ? (
          <iframe
            src={fullUrl}
            className="w-100 h-100"
            title="PDF Viewer"
          ></iframe>
        ) : isUnsupported ? (
          <Alert variant="warning" className="text-center m-4">
            Ushbu fayl turini brauzerda ko‘rsatib bo‘lmaydi. <br />
            Iltimos, faylni yuklab oling.
          </Alert>
        ) : (
          <Alert variant="secondary" className="text-center m-4">
            Noma'lum fayl turi. <br />
            Faylni yuklab ko‘rishingiz mumkin.
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          <FiX className="mr-2" />
          Yopish
        </Button>
        <Button variant="primary" href={fullUrl} download>
          <FiDownload className="mr-2" />
          Yuklab olish
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FileViewerComponent;
