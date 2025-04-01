import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BoxComponent from "../../components/box.component";
import AchievmentService from "../../service/achievment.service";
import { generateSlug } from "../../utils/generateSlug";
import CreateBox from "./create.box";
import {
  FiChevronRight,
  FiAward,
  FiCheckCircle,
  FiBarChart2,
  FiArrowDownLeft,
  FiArrowLeft,
} from "react-icons/fi";

const CreateAchievmetSection = () => {
  const { achievments, isLoading } = useSelector((state) => state.achievment);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug, id } = useParams();

  useEffect(() => {
    AchievmentService.getAchievments(dispatch, id);
  }, [dispatch, id]);

  const sectionAchievments = achievments.find(
    (c) => generateSlug(c.section) === generateSlug(slug)
  );

  const [modalState, setModalState] = useState({
    state: false,
    value: {},
  });

  const calculateProgress = () => {
    if (!sectionAchievments)
      return { completed: 0, total: 0, totalPoints: 0, earnedPoints: 0 };

    const total = sectionAchievments.achievments.length;
    const completed = sectionAchievments.achievments.filter(
      (a) => a.exist
    ).length;

    const totalPoints = sectionAchievments.achievments.reduce((sum, item) => {
      const ratings = item.achievmet?.ratings || [];
      const maxRating =
        ratings.length > 0 ? Math.max(...ratings.map((r) => r.rating || 0)) : 0;
      return sum + maxRating;
    }, 0);

    const earnedPoints = sectionAchievments.achievments.reduce((sum, item) => {
      if (!item.exist) return sum;
      const ratings = item.achievmet?.ratings || [];
      const maxRating =
        ratings.length > 0 ? Math.max(...ratings.map((r) => r.rating || 0)) : 0;
      return sum + maxRating;
    }, 0);

    return { completed, total, totalPoints, earnedPoints };
  };

  const progress = calculateProgress();

  return isLoading ? (
    <div className="p-4">
      <BoxComponent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </BoxComponent>
    </div>
  ) : (
    <div className="p-4">
      {sectionAchievments && (
        <div>
          {modalState.state && (
            <CreateBox
              state={modalState.value}
              setState={setModalState}
              id={id}
            />
          )}

          {/* Section Header */}
          <div className="flex items-center justify-between mb-6 pb-2 border-b">
            <div
              onClick={() => navigate(-1)}
              className="flex cursor-pointer hover:bg-blue-200 px-3  rounded-lg transition-[0.5s] py-2"
            >
              <FiArrowLeft size={24} className="text-primary mr-3" />
              <span className="text-24 font-semibold text-primary ">
                Orqaga
              </span>
            </div>
            <div className="flex items-center">
              <FiAward className="text-primary mr-3" size={24} />
              <h1 className="text-2xl  font-semibold text-gray-800">
                {sectionAchievments.section}
              </h1>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <FiBarChart2 className="text-primary mr-2" size={20} />
                <span className="font-medium">
                  {progress.completed} / {progress.total} yutuq bajarildi
                </span>
              </div>
              <div className="flex items-center">
                <FiBarChart2 className="text-primary mr-2" size={20} />
                <span className="font-medium">
                  {progress.earnedPoints} / {progress.totalPoints} ball
                  to'plandi
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div
                className="h-2.5 rounded-full bg-primary"
                style={{
                  width: `${
                    progress.total > 0
                      ? Math.round((progress.completed / progress.total) * 100)
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Achievements List */}
          <div className="space-y-4">
            {sectionAchievments.achievments.map((item) => (
              <BoxComponent key={item.achievmet.id}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <FiAward
                        className={`mr-3 ${
                          item.exist ? "text-green-500" : "text-primary"
                        }`}
                        size={20}
                      />
                      <h2 className="text-lg font-semibold text-gray-800">
                        {item.achievmet.title}
                      </h2>
                    </div>

                    <div className="pl-9">
                      <h3 className="font-medium mb-2">Baholar:</h3>
                      <ul className="space-y-2">
                        {item.achievmet.ratings.map((rating, index) => (
                          <li key={index} className="flex items-center">
                            <span className="font-semibold w-16">
                              {rating.rating} ball
                            </span>
                            <span className="text-gray-600">
                              - {rating.about}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {item.exist ? (
                      <div className="flex items-center bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm">
                        <FiCheckCircle className="mr-1" size={14} />
                        <span>Yuborilgan</span>
                        <span className="ml-2 text-xs text-gray-500">
                          {new Date(
                            item.achievmet.updatedAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setModalState({ state: true, value: item.achievmet })
                        }
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm flex items-center"
                      >
                        Yuborish
                      </button>
                    )}
                  </div>
                </div>
              </BoxComponent>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAchievmetSection;
