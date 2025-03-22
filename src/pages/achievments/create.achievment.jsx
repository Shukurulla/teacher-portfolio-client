import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BoxComponent from "../../components/box.component";
import AchievmentService from "../../service/achievment.service";
import { generateSlug } from "../../utils/generateSlug";

const CreateAchievment = () => {
  const { achievments, isLoading } = useSelector((state) => state.achievment);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    AchievmentService.getAchievments(dispatch);
  }, []);
  return isLoading ? (
    <p>Loading</p>
  ) : (
    <div className="p-4">
      <BoxComponent>
        <h1 className="text-[25px] mb-3 font-semibold">Bolimlar</h1>
        {achievments.map((item) => (
          <>
            <div
              onClick={() =>
                navigate(
                  `/achievment/create/${id}/section/${generateSlug(
                    item.section
                  )}`
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
    </div>
  );
};

export default CreateAchievment;
