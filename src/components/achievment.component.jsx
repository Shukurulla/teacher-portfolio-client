import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiAward, FiEye, FiClock, FiCheck, FiX } from "react-icons/fi";
import { Button, Badge } from "react-bootstrap";
import FilesService from "../service/file.service";
import FileViewerComponent from "./FileViewerComponent";
import FileImage from "../../public/file.jpg";

const AchievmentComponent = ({ item }) => {
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
    <div key={item._id} className="col-md-12">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5 className="card-title mb-0">{item.achievments.title}</h5>
            <Badge
              bg={getStatusBadge(item.status).variant}
              className="d-flex align-items-center"
            >
              {getStatusBadge(item.status).icon}
              {getStatusBadge(item.status).text}
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

            <div className="file mt-2">
              <a
                onClick={() =>
                  setViewingFile({
                    fileUrl: item.fileUrl,
                    fileName: item.fileName,
                  })
                }
                className="flex cursor-pointer items-center gap-3"
              >
                <img src={FileImage} alt="" width={30} height={30} />
                <p>Fileni ko'rish</p>
              </a>
            </div>
          </div>
        </div>
      </div>
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

export default AchievmentComponent;
