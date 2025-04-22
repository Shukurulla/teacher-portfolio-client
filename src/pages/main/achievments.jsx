import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiAward, FiEye, FiClock, FiCheck, FiX } from "react-icons/fi";
import { Button, Badge } from "react-bootstrap";
import FilesService from "../../service/file.service";
import FileViewerComponent from "../../components/FileViewerComponent";
import AchievmentComponent from "../../components/achievment.component";
import AchievmentService from "../../service/achievment.service";

const AchievementsPage = () => {
  const { myFiles = [], isLoading } = useSelector((state) => state.file); // default empty array
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewingFile, setViewingFile] = useState(null);

  useEffect(() => {
    FilesService.getFiles(dispatch);
    AchievmentService.getAchievments(dispatch);
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
          text: "Jarayonda",
        };
    }
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

  const filesArray = Array.isArray(myFiles) ? myFiles : [];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <FiAward className="me-2" />
          Mening Yutuqlarim
        </h1>
      </div>

      {filesArray.length === 0 ? (
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
            console.log(item);

            return <AchievmentComponent item={item} jobId={item.from.job} />;
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
