import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BoxComponent from "../../components/box.component";
import FilesService from "../../service/file.service";
import FileImage from "../../../public/file.jpg";
import AchievmentComponent from "../../components/achievment.component";
import JobService from "../../service/job.service";
import ModalComponent from "../../components/modal.component";

const Home = () => {
  const { jobs, isLoading } = useSelector((state) => state.job);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [workplace, setWorkplace] = useState("");

  useEffect(() => {
    FilesService.getFiles(dispatch);
    JobService.getJobs(dispatch);
  }, []);

  const submitHandler = () => {
    JobService.createJob(dispatch, { title: jobTitle, workplace });
    setJobTitle("");
    setWorkplace("");
    setOpenModal(false);
  };

  return (
    <div>
      <ModalComponent state={openModal}>
        <div className="w-100 h-100 flex items-center justify-center">
          <div className="w-[50%]">
            <BoxComponent>
              <h1 className="text-xl font-[600]">Kasb qo'shish</h1>
              <div className="mt-4">
                <div class="form-floating">
                  <input
                    type="text"
                    class="form-control"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    id="floatingInput"
                    placeholder="Kasbingiz"
                  />
                  <label for="floatingInput">Kasbingiz</label>
                </div>
                <div class="form-floating my-3">
                  <input
                    type="text"
                    value={workplace}
                    onChange={(e) => setWorkplace(e.target.value)}
                    class="form-control"
                    id="floatingInput"
                    placeholder="Ish joyingiz"
                  />
                  <label for="floatingInput">Ish joyingiz</label>
                </div>
                <button
                  onClick={() => submitHandler()}
                  className="btn btn-primary mr-3"
                  disabled={isLoading}
                >
                  Qoshish
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setOpenModal(false)}
                  disabled={isLoading}
                >
                  Bekor qilish
                </button>
              </div>
            </BoxComponent>
          </div>
        </div>
      </ModalComponent>
      <div className="p-3 pb-[100px]">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[25px] font-semibold ">Mening kasblarim</h1>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-primary text-white px-2 py-1 rounded-md"
          >
            Kasb qoshish
          </button>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {jobs.map((item) => (
              <div className="mb-3">
                <BoxComponent>
                  <div className="flex mb-3 items-center justify-between">
                    <div>
                      <h1 className="text-xl font-[500]">{item.title}</h1>
                      <p>{item.workplace}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => navigate(`/job/${item._id}`)}
                        className="btn btn-primary"
                      >
                        Batafsil
                      </button>
                    </div>
                  </div>
                </BoxComponent>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
