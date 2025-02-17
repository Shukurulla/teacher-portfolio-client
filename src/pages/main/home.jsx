import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BoxComponent from "../../components/box.component";
import FilesService from "../../service/file.service";

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const { myFiles } = useSelector((state) => state.file);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    FilesService.getFiles(dispatch);
  }, []);

  return (
    <div>
      <div className="bg-[#fff] w-100 p-3 rounded-[10px] shadow-md">
        <div className="row">
          <div className="col-3">
            <div className="w-[70%] mx-auto">
              <img
                src="https://as2.ftcdn.net/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                alt=""
              />
            </div>
          </div>
          <div className="col-9">
            <div className="flex items-start justify-between">
              <div className="user-info">
                <h1 className="text-[25px] font-semibold">{user?.firstName}</h1>
                <h1 className="text-[25px] font-semibold py-3">
                  {user?.lastName}
                </h1>
                <h1 className="text-[25px] font-semibold">{user?.phone}</h1>
              </div>
              <div className="action w-[50%] text-end pr-3">
                <button>
                  <i className="bi text-[20px] bi-gear"></i>
                </button>
                <div className="score">
                  <p>Natija: 0 ball</p>
                  <div className="progress">
                    <div className="bg-black w-[0%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-3 pb-[100px]">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[25px] font-semibold ">Mening yutuqlarim</h1>
          <button
            onClick={() => navigate("achievment/create/")}
            className="bg-primary text-white px-2 py-1 rounded-md"
          >
            Yutuq qoshish
          </button>
        </div>
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
                  <div className="file mt-2">
                    <a
                      href={`http://45.134.39.117:7474${item.fileUrl}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src="https://w7.pngwing.com/pngs/521/255/png-transparent-computer-icons-data-file-document-file-format-others-thumbnail.png"
                        alt=""
                        width={50}
                        height={50}
                      />
                      <p>Fileni ko'rish</p>
                    </a>
                  </div>
                </BoxComponent>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
