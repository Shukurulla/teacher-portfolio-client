import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BoxComponent from "../../components/box.component";
import AchievmentService from "../../service/achievment.service";
import { generateSlug } from "../../utils/generateSlug";
import {
  FiChevronRight,
  FiAward,
  FiCheckCircle,
  FiBarChart2,
  FiArrowLeft,
} from "react-icons/fi";

const CreateAchievment = () => {
  const { achievments, isLoading } = useSelector((state) => state.achievment);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    AchievmentService.getAchievments(dispatch, id);
  }, [dispatch, id]);

  const calculateSectionProgress = (section) => {
    if (!section?.achievments) {
      return {
        completed: 0,
        total: 0,
        percentage: 0,
        totalPoints: 0,
        earnedPoints: 0,
      };
    }

    const total = section.achievments.length;
    const completed = section.achievments.filter((a) => a.exist).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const totalPoints = section.achievments.reduce((sum, item) => {
      const ratings = item.achievmet?.ratings || [];
      const maxRating =
        ratings.length > 0 ? Math.max(...ratings.map((r) => r.rating || 0)) : 0;
      return sum + maxRating;
    }, 0);

    const earnedPoints = section.achievments.reduce((sum, item) => {
      if (!item.exist) return sum;
      const ratings = item.achievmet?.ratings || [];
      const maxRating =
        ratings.length > 0 ? Math.max(...ratings.map((r) => r.rating || 0)) : 0;
      return sum + maxRating;
    }, 0);

    return { completed, total, percentage, totalPoints, earnedPoints };
  };

  return isLoading ? (
    <div className="p-2 sm:p-4">
      <BoxComponent>
        <div className="grid gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 sm:p-4 border rounded-lg animate-pulse">
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4 mb-2 sm:mb-3"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-full mb-1 sm:mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </BoxComponent>
    </div>
  ) : (
    <div className="p-2 sm:p-4">
      <BoxComponent>
        <div className="flex items-center justify-between mb-6 pb-2 border-b">
          <div
            onClick={() => navigate(-1)}
            className="flex cursor-pointer hover:bg-blue-200 px-3  rounded-lg transition-[0.5s] py-2"
          >
            <FiArrowLeft size={24} className="text-primary mr-3" />
            <span className="text-24 font-semibold text-primary ">Orqaga</span>
          </div>
          <div className="flex items-center">
            <FiAward className="text-primary mr-3" size={24} />
            <h1 className="text-2xl  font-semibold text-gray-800">
              Yutuq bo'limlari
            </h1>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4">
          {achievments?.map((item, index) => {
            const progress = calculateSectionProgress(item);
            const isComplete = progress.percentage === 100;
            console.log(progress);

            return (
              <div
                key={index}
                onClick={() =>
                  navigate(
                    `/achievment/create/${id}/section/${generateSlug(
                      item.section
                    )}`
                  )
                }
                className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 cursor-pointer group
                  ${
                    isComplete
                      ? "border-green-100 bg-green-50"
                      : "border-gray-200 hover:border-primary hover:bg-blue-50"
                  }
                `}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-2 gap-2">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                        <FiAward
                          className={`mr-2 ${
                            isComplete ? "text-green-500" : "text-primary"
                          }`}
                          size={16}
                        />
                        {item.section}
                      </h2>
                      {isComplete && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center">
                          <FiCheckCircle className="mr-1" size={12} />
                          Yakunlangan
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col xs:flex-row xs:items-center xs:gap-6 gap-2 text-xs sm:text-sm mb-2 sm:mb-3 pl-6">
                      <div className="flex items-center">
                        <FiBarChart2 className="text-gray-400 mr-1" size={12} />
                        <span
                          className={`font-medium ${
                            isComplete ? "text-green-600" : "text-primary"
                          }`}
                        >
                          {progress.completed}/{progress.total} yutuq
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FiBarChart2 className="text-gray-400 mr-1" size={12} />
                        <span
                          className={`font-medium ${
                            isComplete ? "text-green-600" : "text-primary"
                          }`}
                        >
                          {progress.earnedPoints}/{progress.totalPoints} ball
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 ml-6">
                      <div
                        className={`h-2 sm:h-2.5 rounded-full ${
                          isComplete ? "bg-green-500" : "bg-primary"
                        }`}
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-2 sm:mt-0 sm:ml-4 pt-1 self-end sm:self-auto group-hover:translate-x-1 transition-transform">
                    <FiChevronRight
                      className={`${
                        isComplete ? "text-green-500" : "text-gray-400"
                      }`}
                      size={18}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </BoxComponent>
    </div>
  );
};

export default CreateAchievment;
