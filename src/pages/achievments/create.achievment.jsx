import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BoxComponent from "../../components/box.component";
import AchievmentService from "../../service/achievment.service";
import { generateSlug } from "../../utils/generateSlug";

const CreateAchievment = () => {
  const { achievments, isLoading } = useSelector((state) => state.achievment);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    AchievmentService.getAchievments(dispatch);
  }, []);
  return isLoading ? (
    <p>Loading</p>
  ) : (
    <BoxComponent>
      <h1 className="text-[25px] font-semibold">Bolimlar</h1>
      {achievments.map((item) => (
        <>
          <div
            onClick={() =>
              navigate(
                `/achievment/create/section/${generateSlug(item.section)}`
              )
            }
            className="row py-2 px-2 hover:bg-[#96999b48] cursor-pointer text-[18px] font-semibold"
          >
            <div className="col-11">
              <h1 className="">{item.section}</h1>
            </div>
            <div className="col-1">
              <i className="bi bi-chevron-right"> </i>
            </div>
          </div>
        </>
      ))}
    </BoxComponent>
  );
};

export default CreateAchievment;
