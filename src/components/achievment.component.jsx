import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../service/api";
import {
  FiAward,
  FiEye,
  FiClock,
  FiCheck,
  FiX,
  FiTrash2,
  FiMessageSquare,
  FiRefreshCcw,
} from "react-icons/fi";
import FileViewerComponent from "./FileViewerComponent";
import FileImage from "../../public/file.jpg";
import Swal from "sweetalert2";
import CreateBox from "../pages/achievments/create.box";
import { useSelector } from "react-redux";

const AchievmentComponent = ({ item, jobId }) => {
  const queryClient = useQueryClient();
  const [modalState, setModalState] = useState({
    state: false,
    value: {},
  });
  const { achievments, isLoading } = useSelector((state) => state.achievment);
  const [viewingFile, setViewingFile] = useState(null);

  // Yutuqni o'chirish
  const deleteAchievementMutation = useMutation({
    mutationFn: (achievementId) => axios.delete(`/file/${achievementId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs", jobId]);
      Swal.fire({
        title: "Muvaffaqiyatli!",
        text: "Yutuq muvaffaqiyatli o'chirildi",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Xatolik!",
        text:
          error.response?.data?.message ||
          "Yutuqni o'chirishda xatolik yuz berdi",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  const handleDelete = (achievementId) => {
    Swal.fire({
      title: "Yutuqni o'chirish",
      text: "Haqiqatan ham bu yutuqni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ha, o'chirilsin!",
      cancelButtonText: "Bekor qilish",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAchievementMutation.mutate(achievementId);
      }
    });
  };

  const getStatusBadge = () => {
    let badgeClass = "";
    let icon = null;
    let text = "";

    switch (item.status) {
      case "Tasdiqlandi":
        badgeClass = "bg-green-100 text-green-800";
        icon = <FiCheck className="mr-1" />;
        text = "Tasdiqlandi";
        break;
      case "Tasdiqlanmadi":
        badgeClass = "bg-red-100 text-red-800";
        icon = <FiX className="mr-1" />;
        text = "Tasdiqlanmadi";
        break;
      default:
        badgeClass = "bg-yellow-100 text-yellow-800";
        icon = <FiClock className="mr-1" />;
        text = "Kutilmoqda";
    }

    return { badgeClass, icon, text };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="border bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {modalState.state && (
        <CreateBox
          state={modalState.value}
          setState={setModalState}
          id={item.from.job}
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{item.achievments.title}</h3>
            <p className="text-gray-600 text-sm">{item.achievments.section}</p>
            {item.achievments.rating && (
              <p className="text-gray-600 text-sm mt-1">
                {item.achievments.rating.ratingTitle} (
                {item.achievments.rating.rating}/5)
              </p>
            )}
          </div>
          <div>
            <span
              className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium ${statusBadge.badgeClass}`}
            >
              {statusBadge.icon}
              {statusBadge.text}
            </span>
            {statusBadge.text == "Tasdiqlanmadi" ? (
              <button
                onClick={() =>
                  setModalState({
                    state: true,
                    value: achievments
                      .filter((c) => c.section == item.achievments.section)[0]
                      .achievments.find(
                        (c) => c.achievmet.title == item.achievments.title
                      ).achievmet,
                  })
                }
                className="ml-3 inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium bg-blue-200 text-blue-700"
              >
                <FiRefreshCcw /> <span className="ml-2">qayta jonatish</span>
              </button>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            {item.score && (
              <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                <FiAward className="mr-1" />
                Ball: {item.score}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setViewingFile({
                  fileUrl: item.fileUrl,
                  fileName: item.fileName,
                })
              }
              className="flex items-center text-sm text-gray-600 hover:text-primary"
            >
              <FiEye className="mr-1" />
              Faylni ko'rish
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              className="flex items-center text-sm text-gray-600 hover:text-red-500"
            >
              <FiTrash2 className="mr-1" />
              O'chirish
            </button>
          </div>
        </div>

        {item.resultMessage && (
          <div
            className={`mt-3 p-3 rounded-md border-l-4 ${
              item.status === "Tasdiqlandi"
                ? "bg-green-50 text-green-800 border-green-500"
                : "bg-red-50 text-red-800 border-red-500"
            }`}
          >
            <div className="flex items-start">
              <div
                className={`p-1 rounded-full mr-3 ${
                  item.status === "Tasdiqlandi"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                <FiMessageSquare className="text-sm" />
              </div>
              <div className="flex-1">
                <p className="text-sm">{item.resultMessage}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {viewingFile && (
        <FileViewerComponent
          files={item.files}
          onClose={() => setViewingFile(null)}
        />
      )}
    </div>
  );
};

export default AchievmentComponent;
