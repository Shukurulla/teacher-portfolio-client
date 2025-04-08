import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../service/api";
import { useSelector, useDispatch } from "react-redux";
import BoxComponent from "../../components/box.component";
import AchievmentComponent from "../../components/achievment.component";
import ModalComponent from "../../components/modal.component";
import {
  FiPlus,
  FiBriefcase,
  FiAward,
  FiX,
  FiCheck,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { generateSlug } from "../../utils/generateSlug";
import Swal from "sweetalert2";
import AchievmentService from "../../service/achievment.service";

const Button = ({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
  icon,
}) => {
  const baseStyles =
    "flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary: "bg-primary hover:bg-primary-dark text-white focus:ring-primary",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const JobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editModal, setEditModal] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [workplace, setWorkplace] = useState("");
  const { achievments } = useSelector((state) => state.achievment);

  const dispatch = useDispatch();
  // Kasb ma'lumotlarini olish
  const fetchJobs = async () => {
    const response = await axios.get(`/job/${id}`);
    console.log(response.data.data);

    return response.data.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["jobs", id],
    queryFn: fetchJobs,
    onSuccess: (data) => {
      if (data?.job) {
        setJobTitle(data.job.title);
        setWorkplace(data.job.workplace);
      }
    },
  });

  useEffect(() => {
    if (data?.job) {
      setJobTitle(data.job.title);
      setWorkplace(data.job.workplace);
    }
  }, [data]);
  useEffect(() => {
    AchievmentService.getAchievments(dispatch);
  }, []);

  // Kasbni yangilash
  const updateJobMutation = useMutation({
    mutationFn: (updatedJob) => axios.put(`/job/${id}`, updatedJob),
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs", id]);
      setEditModal(false);
      Swal.fire({
        title: "Muvaffaqiyatli!",
        text: "Kasb ma'lumotlari yangilandi",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Xatolik!",
        text:
          error.response?.data?.message ||
          "Ma'lumotlarni yangilashda xatolik yuz berdi",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  // Kasbni o'chirish
  const deleteJobMutation = useMutation({
    mutationFn: () => axios.delete(`/job/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
      navigate("/");
      Swal.fire({
        title: "Muvaffaqiyatli!",
        text: "Kasb muvaffaqiyatli o'chirildi",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Xatolik!",
        text: error.response?.data?.message || "O'chirishda xatolik yuz berdi",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  const handleUpdateJob = () => {
    updateJobMutation.mutate({ title: jobTitle, workplace });
  };

  const handleDeleteJob = () => {
    Swal.fire({
      title: "Kasbni o'chirish",
      text: "Haqiqatan ham bu kasbni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ha, o'chirilsin!",
      cancelButtonText: "Bekor qilish",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteJobMutation.mutate();
      }
    });
  };

  // Faqat tasdiqlangan yutuqlarning umumiy ballini hisoblash
  const totalScore =
    data?.files
      ?.filter((f) => f.status === "Tasdiqlandi")
      .reduce((sum, file) => {
        return sum + (file.achievments.rating.rating || 0);
      }, 0) || 0;

  return (
    <div className="py-4">
      {isLoading ? (
        <BoxComponent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </BoxComponent>
      ) : (
        <>
          <ModalComponent
            state={editModal}
            onClose={() => setEditModal(false)}
            style={{ zIndex: 9999 }}
          >
            <div className="w-[80%] py-5 mx-auto">
              <BoxComponent>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-semibold">Kasbni tahrirlash</h1>
                    <button
                      onClick={() => setEditModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kasbingiz
                      </label>
                      <select
                        value={jobTitle}
                        disabled
                        className="w-full block text-sm font-medium p-2 outline-none border-[1px] border-gray-300 rounded-md text-gray-700 mb-1"
                        onChange={(e) => setJobTitle(e.target.value)}
                      >
                        {achievments.map((item) => (
                          <option value={item.section}>{item.section}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ish joyingiz
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={workplace}
                        onChange={(e) => setWorkplace(e.target.value)}
                        placeholder="Ish joyi nomi"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteJob()}
                        icon={<FiTrash2 className="mr-1" />}
                      >
                        O'chirish
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditModal(false)}
                      >
                        Bekor qilish
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleUpdateJob}
                        disabled={
                          !jobTitle || !workplace || updateJobMutation.isLoading
                        }
                        icon={<FiCheck className="mr-1" />}
                      >
                        {updateJobMutation.isLoading
                          ? "Saqlanmoqda..."
                          : "Saqlash"}
                      </Button>
                    </div>
                  </div>
                </div>
              </BoxComponent>
            </div>
          </ModalComponent>

          <div className="p-4">
            <BoxComponent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-xl font-semibold">
                        {data?.job?.title || "Kasb nomi"}
                      </h1>
                      <p className="text-gray-600 mt-1">
                        {data?.job?.workplace || "Ish joyi"}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded flex items-center">
                          <FiAward className="mr-1" />
                          Tasdiqlangan yutuqlar:{" "}
                          {data?.files?.filter(
                            (f) => f.status === "Tasdiqlandi"
                          ).length || 0}
                        </span>
                        <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded flex items-center">
                          <FiAward className="mr-1" />
                          Umumiy ball: {totalScore}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditModal(true)}
                        className="text-gray-500 hover:text-primary p-2 rounded-full hover:bg-gray-100"
                        title="Tahrirlash"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={handleDeleteJob}
                        className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-100"
                        title="O'chirish"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="sm:mt-0">
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      navigate(
                        `/achievment/create/${id}/section/${generateSlug(
                          data?.job?.title
                        )}`
                      )
                    }
                    icon={<FiPlus className="mr-1" />}
                  >
                    Yutuq qo'shish
                  </Button>
                </div>
              </div>
            </BoxComponent>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <FiAward className="mr-2 text-primary" />
                  Yutuqlar
                </h2>
              </div>

              {data?.files?.length === 0 ? (
                <BoxComponent>
                  <div className="text-center py-8 text-gray-500">
                    <FiAward className="mx-auto text-3xl mb-3 text-gray-300" />
                    <p className="mb-4">Hozircha yutuqlar mavjud emas</p>
                    <div className="flex justify-center">
                      <Button
                        variant="primary"
                        onClick={() =>
                          navigate(
                            `/achievment/create/${id}/section/${generateSlug(
                              data?.job?.title
                            )}`
                          )
                        }
                        icon={<FiPlus className="mr-1" />}
                      >
                        Birinchi yutuqni qo'shish
                      </Button>
                    </div>
                  </div>
                </BoxComponent>
              ) : (
                <div className="grid gap-4">
                  {data?.files?.map((item) => (
                    <AchievmentComponent
                      key={item._id}
                      item={item}
                      jobId={id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JobPage;
