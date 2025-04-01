import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiBriefcase, FiAward, FiBook, FiArrowRight } from "react-icons/fi";
import JobService from "../../service/job.service";
import FileService from "../../service/file.service";
import FilesService from "../../service/file.service";

const TeacherJobsPage = () => {
  const { jobs, isLoading } = useSelector((state) => state.job);
  const { myFiles } = useSelector((state) => state.file);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    JobService.getJobs(dispatch);
    FilesService.getFiles(dispatch);
  }, []);

  // Har bir ish joyi uchun yutuqlar sonini hisoblash
  const getAchievementsCount = (jobId) => {
    return myFiles.filter((file) => file.from.job._id === jobId).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Ish Joylarim</h1>
          <p className="text-gray-600 mt-2">
            Faoliyat olib borayotgan muassasalar
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <FiBook className="mr-3 text-blue-500" />
                      <span>Asosiy fan: {job.title}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FiAward className="mr-3 text-yellow-500" />
                      <span>{getAchievementsCount(job._id)} ta yutuq</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FiBriefcase className="mr-3 text-green-500" />
                      <span>{job.workplace}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/job/${job._id}`)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mt-4"
                  >
                    <span>Batafsil ko'rish</span>
                    <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Ish joylari mavjud emas
            </h3>
            <p className="text-gray-500">
              Hozircha qo'shilgan ish joylaringiz yo'q
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherJobsPage;
