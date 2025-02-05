import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BoxComponent from "../../components/box.component";
import FilesService from "../../service/file.service";

const Achievments = () => {
  const { myFiles, isLoading } = useSelector((state) => state.file);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    FilesService.getFiles(dispatch);
  }, []);
  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <div>
      <div className="">
        {myFiles.length == 0 ? (
          <div className="bg-[#fff] text-center w-100 p-3 rounded-[10px] shadow-md mt-3">
            <h1 className="text-[20px] font-semibold">
              Sizning yutuqlaringiz topilmadi
            </h1>

            <div
              onClick={() => navigate("/achievment/create")}
              className=" inline-block p-3 border-3 mt-2 rounded-lg cursor-pointer border-[#5c5b5b]"
            >
              <i className="bi bi-plus-lg text-[20px]"></i>
              <span className="block">Yutuq qoshish</span>
            </div>
          </div>
        ) : (
          myFiles.map((item) => (
            <div className="mt-3">
              <BoxComponent>
                <div className="section mb-3 font-bold flex items-center justify-between">
                  <h1>{item.achievments.section}</h1>
                  <div className="bg-orange-600 text-[14px] py-1 px-2 rounded-md font-semibold text-white">
                    {item.status}
                  </div>
                </div>
                <div className="title mt-3 flex item-center justify-between font-semibold">
                  <h1>{item.achievments.title}</h1>
                  <p>{item.achievments.rating.ratingTitle}</p>
                </div>
                <div className="file"></div>
              </BoxComponent>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Achievments;
