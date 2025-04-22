import React, { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import {
  FiX,
  FiDownload,
  FiFile,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const getFileExtension = (fileName) => {
  return fileName?.split(".").pop().toLowerCase();
};

const FileViewerComponent = ({ files, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentFile = files[currentIndex];
  const fileExtension = getFileExtension(currentFile.fileUrl);
  const fullUrl = `https://server.portfolio-sport.uz${currentFile.fileUrl}`;

  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension);
  const isPDF = fileExtension === "pdf";
  const isUnsupported = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(
    fileExtension
  );

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : files.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < files.length - 1 ? prev + 1 : 0));
  };

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
          {currentFile.fileTitle || "Fayl ko'ruvchi"}
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
            alt={currentFile.fileTitle}
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
            Ushbu fayl turini brauzerda ko'rsatib bo'lmaydi. <br />
            Iltimos, faylni yuklab oling.
          </Alert>
        ) : (
          <Alert variant="secondary" className="text-center m-4">
            Noma'lum fayl turi. <br />
            Faylni yuklab ko'rishingiz mumkin.
          </Alert>
        )}

        {files.length > 1 && (
          <>
            <Button
              variant="light"
              onClick={goToPrevious}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            >
              <FiChevronLeft size={24} />
            </Button>
            <Button
              variant="light"
              onClick={goToNext}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            >
              <FiChevronRight size={24} />
            </Button>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between align-items-center">
        <div>
          {files.length > 1 && (
            <span className="mr-3">
              {currentIndex + 1} / {files.length}
            </span>
          )}
        </div>
        <div>
          <Button variant="secondary" onClick={onClose} className="mr-2">
            <FiX className="mr-2" />
            Yopish
          </Button>
          <Button variant="primary" href={fullUrl} download="image">
            <FiDownload className="mr-2" />
            Yuklab olish
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default FileViewerComponent;
