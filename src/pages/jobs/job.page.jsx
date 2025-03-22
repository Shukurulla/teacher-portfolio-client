import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import JobService from "../../service/job.service";
import { useQuery } from "@tanstack/react-query";
import axios from "../../service/api";
import BoxComponent from "../../components/box.component";
import AchievmentComponent from "../../components/achievment.component";
import ModalComponent from "../../components/modal.component";

const JobPage = () => {
  const { id } = useParams();
  const fetchJobs = async () => {
    const response = await axios.get(`/job/${id}`);

    return response.data.data;
  };
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [workplace, setWorkplace] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs", id], // id qo'shildi
    queryFn: fetchJobs,
  });

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  return isLoading ? (
    <>Loading...</>
  ) : (
    <>
      <ModalComponent state={openModal}>
        <div className="w-100 h-100 flex items-center justify-center">
          <div className="w-[50%]">
            <BoxComponent>
              <h1 className="text-xl font-[600]">Kasb qo'shish</h1>
              <div className="mt-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    id="floatingInput"
                    placeholder="Kasbingiz"
                  />
                  <label htmlFor="floatingInput">Kasbingiz</label>
                </div>
                <div className="form-floating my-3">
                  <input
                    type="text"
                    value={workplace}
                    onChange={(e) => setWorkplace(e.target.value)}
                    className="form-control"
                    id="floatingInput"
                    placeholder="Ish joyingiz"
                  />
                  <label htmlFor="floatingInput">Ish joyingiz</label>
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
      <div className="p-3">
        <BoxComponent>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-[500]">{data?.job?.title}</h1>
              <p>{data?.job?.workplace}</p>
            </div>
          </div>
        </BoxComponent>
        <h1 className="mt-3 text-xl font-[500]">Yutuqlar</h1>
        <div
          onClick={() => navigate(`/achievment/create/${id}`)}
          className="fixed w-[50px] h-[50px] text-white rounded-full flex items-center justify-center cursor-pointer bg-primary bottom-10 right-10"
        >
          <i className="bi bi-plus-lg text-2xl"></i>
        </div>
        {data?.files?.length === 0 ? (
          <p>Malumotlar topilmadi</p>
        ) : (
          data?.files?.map((item, index) => (
            <div key={index} className="mt-3">
              <AchievmentComponent item={item} />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default JobPage;
