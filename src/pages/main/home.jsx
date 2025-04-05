import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiAward,
  FiBook,
  FiArrowRight,
  FiPlus,
  FiChevronDown,
} from "react-icons/fi";
import JobService from "../../service/job.service";
import FileService from "../../service/file.service";
import FilesService from "../../service/file.service";
import AchievmentService from "../../service/achievment.service";

const TeacherJobsPage = () => {
  const { jobs, isLoading } = useSelector((state) => state.job);
  const { myFiles } = useSelector((state) => state.file);
  const { achievments } = useSelector((state) => state.achievment);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    JobService.getJobs(dispatch);
    FilesService.getFiles(dispatch);
    AchievmentService.getAchievments(dispatch);
  }, []);

  const getAchievementsCount = (jobId) => {
    return myFiles.filter((file) => file.from.job._id === jobId).length;
  };
  const filteredAchievments = achievments.filter((item) =>
    item.section.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleAddJob = async () => {
    await JobService.createJob(dispatch, { title, workplace });
    setIsModalOpen(false);
    setTitle("");
    setWorkplace("");
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Ish Joylarim</h1>
            <p className="text-gray-600 mt-2">
              Faoliyat olib borayotgan muassasalar
            </p>
          </div>
          {jobs.length > 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <FiPlus className="mr-2" />
              Ish joyi qo'shish
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-200"
              >
                <div className="p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                      {job.title}
                    </h2>
                    <p className="text-gray-600 font-medium">{job.workplace}</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-700">
                      <div className="w-[5%]">
                        <FiBook className="mr-3 text-blue-500" />
                      </div>
                      <div className="w-[95%]">
                        <span>Asosiy fan: {job.subject || job.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-[5%]">
                        <FiAward className="mr-3 text-yellow-500" />
                      </div>
                      <div className="w-[95%]">
                        <span>{getAchievementsCount(job._id)} ta yutuq</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-[5%]">
                        <FiBriefcase className="mr-3 text-green-500" />
                      </div>
                      <div className="w-[95%]">
                        <span>{job.workplace}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => navigate(`/job/${job._id}`)}
                      className=" flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mt-4"
                    >
                      <span>Batafsil ko'rish</span>
                      <FiArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Ish joylari mavjud emas
            </h3>
            <p className="text-gray-500 mb-6">
              Hozircha qo'shilgan ish joylaringiz yo'q
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center mx-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <FiPlus className="mr-2" />
              Ish joyi qo'shish
            </button>
          </div>
        )}

        {/* Add Job Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Yangi ish joyi qo'shish
                </h2>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lavozim
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <span className="truncate">
                          {title || "Lavozimni tanlang"}
                        </span>
                        <FiChevronDown
                          className={`h-5 w-5 text-gray-400 transition-transform ${
                            isDropdownOpen ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          <div className="px-3 py-2 sticky top-0 bg-white border-b">
                            <input
                              type="text"
                              placeholder="Qidirish..."
                              className="w-full px-2 py-1 border rounded text-sm"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {filteredAchievments.length > 0 ? (
                              filteredAchievments.map((item) => (
                                <div
                                  key={item._id}
                                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                                  onClick={() => {
                                    setTitle(item.section);
                                    setIsDropdownOpen(false);
                                    setSearchTerm("");
                                  }}
                                >
                                  <div className="flex items-center">
                                    <span className="block truncate">
                                      {item.section}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-gray-500 text-sm">
                                Hech narsa topilmadi
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ish joyi (Muassasa)
                    </label>
                    <input
                      type="text"
                      name="workplace"
                      value={workplace}
                      required
                      onChange={(e) => setWorkplace(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Masalan: 15-sonli maktab"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsDropdownOpen(false);
                      setSearchTerm("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleAddJob}
                    disabled={!title || !workplace}
                    className={`px-4 py-2 rounded-md transition ${
                      !title || !workplace
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    Qo'shish
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherJobsPage;
