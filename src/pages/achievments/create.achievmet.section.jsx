import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BoxComponent from "../../components/box.component";
import AchievmentService from "../../service/achievment.service";
import { generateSlug } from "../../utils/generateSlug";
import CreateBox from "./create.box";

const CreateAchievmetSection = () => {
  const { achievments, isLoading } = useSelector((state) => state.achievment);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    AchievmentService.getAchievments(dispatch);
  }, []);
  const { slug } = useParams();
  const sectionAchievments = achievments.filter(
    (c) => generateSlug(c.section) == generateSlug(slug)
  )[0];

  const [modalState, setModalState] = useState({
    state: false,
    value: {},
  });

  return isLoading ? (
    <p>Loading</p>
  ) : (
    <div className="pb-5">
      {sectionAchievments ? (
        <div className={``}>
          {modalState.state ? (
            <CreateBox state={modalState.value} setState={setModalState} />
          ) : (
            ""
          )}
          <h1 className="font-semibold text-[20px] mb-2">
            {sectionAchievments.section}
          </h1>
          {sectionAchievments.achievments.map((item) => (
            <div className="my-3">
              <BoxComponent>
                <div className="title flex items-center justify-between text-[17px] font-semibold">
                  <h1> {item.achievmet.title}</h1>
                  {item.exist ? (
                    <div className="bg-success px-2 py-1 text-white rounded-md text-[15px]">
                      Yutuq yuborilgan
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setModalState({ state: true, value: item.achievmet })
                      }
                      className="bg-primary px-2 py-1 text-[15px] text-white rounded-md"
                    >
                      Yuborish
                    </button>
                  )}
                </div>
                <h1>
                  <b>Baholar</b>
                </h1>
                <div className="flex items-end justify-between">
                  <ul>
                    {item.achievmet.ratings.map((item) => (
                      <li>
                        <span className="font-semibold">
                          {item.rating} ball
                        </span>{" "}
                        - {item.about}
                      </li>
                    ))}
                  </ul>
                </div>
              </BoxComponent>
            </div>
          ))}
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default CreateAchievmetSection;
