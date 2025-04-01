import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiAward, FiEye, FiClock, FiCheck, FiX } from "react-icons/fi";
import { Button, Badge } from "react-bootstrap";
import FilesService from "../../service/file.service";
import FileViewerComponent from "../../components/FileViewerComponent";

const AchievementsPage = () => {
  const { myFiles, isLoading } = useSelector((state) => state.file);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewingFile, setViewingFile] = useState(null);

  useEffect(() => {
    FilesService.getFiles(dispatch);
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Tasdiqlandi":
        return {
          icon: <FiCheck className="mr-1" />,
          variant: "success",
          text: "Tasdiqlangan",
        };
      case "Tasdiqlanmadi":
        return {
          icon: <FiX className="mr-1" />,
          variant: "danger",
          text: "Rad etilgan",
        };
      default:
        return {
          icon: <FiClock className="mr-1" />,
          variant: "warning",
          text: "Kutilmoqda",
        };
    }
  };

  const handleCreateAchievement = () => {
    navigate("/achievement/create");
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <FiAward className="me-2" />
          Mening Yutuqlarim
        </h1>
      </div>

      {myFiles.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <FiAward size={48} className="text-muted mb-3" />
            <h5 className="card-title">Yutuqlar topilmadi</h5>
            <p className="card-text">
              Siz hali hech qanday yutuq qo'shmagansiz
            </p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {myFiles.map((item) => {
            const status = getStatusBadge(item.status);
            return (
              <div key={item._id} className="col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0">
                        {item.achievments.title}
                      </h5>
                      <Badge
                        bg={status.variant}
                        className="d-flex align-items-center"
                      >
                        {status.icon}
                        {status.text}
                      </Badge>
                    </div>

                    <p className="card-text text-muted mb-3">
                      {item.achievments.section}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="badge bg-light text-dark me-2">
                          <FiAward className="me-1" />
                          {item.achievments.rating.rating}/5
                        </span>
                        <small className="text-muted">
                          {item.achievments.rating.ratingTitle}
                        </small>
                      </div>

                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() =>
                          setViewingFile({
                            fileUrl: item.fileUrl,
                            fileName: item.fileName,
                          })
                        }
                        className="d-flex align-items-center"
                      >
                        <FiEye className="me-1" />
                        Ko'rish
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fayl ko'ruvchi modal */}
      {viewingFile && (
        <FileViewerComponent
          fileUrl={viewingFile.fileUrl}
          fileName={viewingFile.fileName}
          onClose={() => setViewingFile(null)}
        />
      )}
    </div>
  );
};

export default AchievementsPage;
