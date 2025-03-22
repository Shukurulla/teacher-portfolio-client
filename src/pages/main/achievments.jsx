import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BoxComponent from "../../components/box.component";
import FilesService from "../../service/file.service";
import FileImage from "../../../public/file.jpg";
import AchievmentComponent from "../../components/achievment.component";

const Achievments = () => {
  const { myFiles, isLoading } = useSelector((state) => state.file);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    FilesService.getFiles(dispatch);
  }, []);
  return isLoading ? (
    <p className="p-4">Loading...</p>
  ) : (
    <div>
      <div className="p-4">
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
          myFiles.myFiles.map((item) => (
            <div className="mt-3">
              <AchievmentComponent item={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Achievments;
