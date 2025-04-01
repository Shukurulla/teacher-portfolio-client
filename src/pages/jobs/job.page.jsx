import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../service/api";
import BoxComponent from "../../components/box.component";
import AchievmentComponent from "../../components/achievment.component";
import ModalComponent from "../../components/modal.component";
import { FiPlus, FiBriefcase, FiAward, FiX, FiCheck } from "react-icons/fi";

// Custom Button Component
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
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400",
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
  const [openModal, setOpenModal] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [workplace, setWorkplace] = useState("");

  const fetchJobs = async () => {
    const response = await axios.get(`/job/${id}`);
    return response.data.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["jobs", id],
    queryFn: fetchJobs,
  });

  const submitHandler = () => {
    // Add your submission logic here
    console.log("Submitting:", { jobTitle, workplace });
    setOpenModal(false);
  };

  return (
    <div className="p-4">
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
          <ModalComponent state={openModal} onClose={() => setOpenModal(false)}>
            <BoxComponent>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-semibold flex items-center">
                    <FiBriefcase className="mr-2 text-primary" />
                    Kasb qo'shish
                  </h1>
                  <button
                    onClick={() => setOpenModal(false)}
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
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Kasb nomi"
                    />
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
                      variant="secondary"
                      onClick={() => setOpenModal(false)}
                    >
                      Bekor qilish
                    </Button>
                    <Button
                      variant="primary"
                      onClick={submitHandler}
                      disabled={!jobTitle || !workplace}
                      icon={<FiCheck className="mr-1" />}
                    >
                      Qo'shish
                    </Button>
                  </div>
                </div>
              </div>
            </BoxComponent>
          </ModalComponent>

          {/* Job Information */}
          <BoxComponent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold flex items-center">
                  <FiBriefcase className="mr-2 text-primary" />
                  {data?.job?.title || "Kasb nomi"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {data?.job?.workplace || "Ish joyi"}
                </p>
              </div>
              <div className="mt-3 sm:mt-0">
                <Button
                  variant="primary"
                  onClick={() => navigate(`/achievment/create/${id}`)}
                  icon={<FiPlus className="mr-1" />}
                >
                  Yutuq qo'shish
                </Button>
              </div>
            </div>
          </BoxComponent>

          {/* Achievements Section */}
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
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/achievment/create/${id}`)}
                    icon={<FiPlus className="mr-1" />}
                  >
                    Birinchi yutuqni qo'shish
                  </Button>
                </div>
              </BoxComponent>
            ) : (
              <div className="space-y-4">
                {data?.files?.map((item, index) => (
                  <AchievmentComponent key={index} item={item} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default JobPage;
