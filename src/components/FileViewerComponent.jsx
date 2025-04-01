import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Button,
  Spinner,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FiX,
  FiDownload,
  FiFile,
  FiZoomIn,
  FiZoomOut,
  FiMaximize2,
  FiMinimize2,
  FiRotateCw,
  FiHome,
} from "react-icons/fi";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const FileViewerComponent = ({ fileUrl, fileName, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  const viewerContainerRef = useRef(null);
  const imageRef = useRef(null);

  const fileExtension = fileName?.split(".").pop().toLowerCase();

  // Add WebP to supported formats
  const supportedFormats = [
    "bmp",
    "doc",
    "docx",
    "htm",
    "html",
    "jpg",
    "jpeg",
    "pdf",
    "png",
    "ppt",
    "pptx",
    "tiff",
    "txt",
    "xls",
    "xlsx",
    "webp",
  ];

  // Check if Office file type
  const isOfficeFile = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(
    fileExtension
  );

  // Check if image file type
  const isImageFile = ["jpg", "jpeg", "png", "bmp", "webp", "tiff"].includes(
    fileExtension
  );

  // Ensure URL is properly formatted
  const fullUrl = fileUrl.startsWith("http")
    ? fileUrl
    : "http://localhost:7474" + fileUrl;

  // Set timeout to handle stalled loading state
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        if (loading) {
          setError(true);
          setLoading(false);
        }
      }, 15000); // 15 second timeout

      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Zoom handlers with preset levels
  const zoomIn = () => {
    setZoom((prev) => {
      if (prev < 0.5) return 0.5;
      if (prev < 0.75) return 0.75;
      if (prev < 1) return 1;
      if (prev < 1.25) return 1.25;
      if (prev < 1.5) return 1.5;
      if (prev < 2) return 2;
      if (prev < 2.5) return 2.5;
      if (prev < 3) return 3;
      return 4;
    });
  };

  const zoomOut = () => {
    setZoom((prev) => {
      if (prev > 4) return 4;
      if (prev > 3) return 3;
      if (prev > 2.5) return 2.5;
      if (prev > 2) return 2;
      if (prev > 1.5) return 1.5;
      if (prev > 1.25) return 1.25;
      if (prev > 1) return 1;
      if (prev > 0.75) return 0.75;
      return 0.5;
    });
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  // Rotation handler
  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Panning handlers for images
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button

    setIsDragging(true);
    setStartPoint({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - startPoint.x,
      y: e.clientY - startPoint.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse wheel zoom
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    }
  };

  // Set up wheel event listener
  useEffect(() => {
    const container = viewerContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, [viewerContainerRef]);

  // Add event listeners for panning
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  // Image renderer with professional zoom, pan and rotate
  const ImageViewer = () => {
    return (
      <div
        ref={viewerContainerRef}
        className="image-viewer-container"
        style={{
          height: "100%",
          overflow: "hidden",
          position: "relative",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          ref={imageRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          <img
            src={fullUrl}
            alt={fileName}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
            }}
            onLoad={() => setLoading(false)}
            onError={() => setError(true)}
          />
        </div>
      </div>
    );
  };

  // PDF viewer with improved zoom and pan
  const PdfViewer = () => {
    return (
      <div
        ref={viewerContainerRef}
        style={{
          height: "100%",
          overflow: "hidden",
          position: "relative",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
            width: "100%",
            height: "100%",
          }}
        >
          <iframe
            src={`${fullUrl}#toolbar=0&view=FitH`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            onLoad={() => setLoading(false)}
            onError={() => setError(true)}
          />
        </div>
      </div>
    );
  };

  // Office document viewer using multiple fallbacks
  const OfficeViewer = () => {
    // Try multiple methods to open Office files
    const microsoftUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      fullUrl
    )}`;
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
      fullUrl
    )}&embedded=true`;

    // Use Microsoft Office Online as primary with Google Docs as fallback
    const [viewerFailed, setViewerFailed] = useState(false);

    return (
      <div style={{ height: "100%", width: "100%" }}>
        {!viewerFailed ? (
          <iframe
            src={microsoftUrl}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            onLoad={() => setLoading(false)}
            onError={() => {
              console.log("Microsoft viewer failed, trying Google Docs");
              setViewerFailed(true);
            }}
          />
        ) : (
          <iframe
            src={googleViewerUrl}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            onLoad={() => setLoading(false)}
            onError={() => setError(true)}
          />
        )}
      </div>
    );
  };

  // Generic file viewer for other formats using DocViewer
  const GenericViewer = () => {
    return (
      <DocViewer
        documents={[
          {
            uri: fullUrl,
            fileName: fileName || "Document",
          },
        ]}
        pluginRenderers={DocViewerRenderers}
        config={{
          header: {
            disableHeader: true,
            disableFileName: true,
          },
          pdfZoom: {
            defaultZoom: 1.0,
            zoomJump: 0.2,
          },
        }}
        style={{ height: "100%" }}
        onError={() => setError(true)}
      />
    );
  };

  // Control panel for zoom, rotate, reset
  const ControlPanel = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          backgroundColor: "rgba(255,255,255,0.8)",
          borderRadius: "4px",
          padding: "5px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <ButtonGroup size="sm">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Kichiklashtirish</Tooltip>}
          >
            <Button variant="light" onClick={zoomOut}>
              <FiZoomOut />
            </Button>
          </OverlayTrigger>

          <Button variant="light" disabled>
            {Math.round(zoom * 100)}%
          </Button>

          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Kattalashtirish</Tooltip>}
          >
            <Button variant="light" onClick={zoomIn}>
              <FiZoomIn />
            </Button>
          </OverlayTrigger>

          {(isImageFile || fileExtension === "pdf") && (
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip>Aylantirish</Tooltip>}
            >
              <Button variant="light" onClick={rotateImage}>
                <FiRotateCw />
              </Button>
            </OverlayTrigger>
          )}

          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Asl o'lcham</Tooltip>}
          >
            <Button variant="light" onClick={resetZoom}>
              <FiHome />
            </Button>
          </OverlayTrigger>
        </ButtonGroup>
      </div>
    );
  };

  // Open file in new tab function
  const openInNewTab = () => {
    window.open(fullUrl, "_blank");
  };

  const isSupported = supportedFormats.includes(fileExtension);

  // Determine which viewer to use based on file type
  const renderContent = () => {
    if (!isSupported) {
      return (
        <div className="d-flex flex-column justify-content-center align-items-center h-100">
          <FiFile size={48} className="mb-3 text-muted" />
          <p className="text-muted">Ushbu fayl formatini ko'rsatib bo'lmadi</p>
          <Button variant="primary" href={fullUrl} download className="mt-2">
            <FiDownload className="mr-2" />
            Yuklab olish
          </Button>
        </div>
      );
    }

    return (
      <>
        {isImageFile && <ImageViewer />}
        {fileExtension === "pdf" && <PdfViewer />}
        {isOfficeFile && <OfficeViewer />}
        {!isImageFile && fileExtension !== "pdf" && !isOfficeFile && (
          <GenericViewer />
        )}

        {/* Show control panel for images and PDFs */}
        {(isImageFile || fileExtension === "pdf") && <ControlPanel />}
      </>
    );
  };

  return (
    <Modal
      show={true}
      onHide={onClose}
      size="lg"
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
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.8)",
            }}
          >
            <Spinner animation="border" role="status">
              <span className="sr-only">Yuklanmoqda...</span>
            </Spinner>
          </div>
        )}

        {error ? (
          <div className="d-flex flex-column justify-content-center align-items-center h-100">
            <FiFile size={48} className="mb-3 text-muted" />
            <p className="text-muted text-center">
              Произошла ошибка. К сожалению, по какой-то причине мы не можем это
              открыть.
            </p>
            <div className="d-flex mt-2">
              <Button
                variant="outline-primary"
                className="mr-2"
                onClick={openInNewTab}
              >
                Yangi oynada ochish
              </Button>
              <Button variant="primary" href={fullUrl} download>
                <FiDownload className="mr-1" />
                Yuklab olish
              </Button>
            </div>
          </div>
        ) : (
          renderContent()
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
