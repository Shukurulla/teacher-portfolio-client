import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BoxComponent from "../../components/box.component";
import FilesService from "../../service/file.service";
import AchievmentService from "../../service/achievment.service";

const CreateBox = ({ state, setState, id }) => {
  const [file, setFile] = useState();
  const dispatch = useDispatch();
  const [rating, setRating] = useState(state.ratings[0].about);
  const { isLoading } = useSelector((state) => state.file);
  const { user } = useSelector((state) => state.user);

  const changeFile = (e) => {
    setFile(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(id);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", state.title);
    formData.append("teacherId", user._id);
    formData.append("achievmentId", state._id);
    formData.append("ratingTitle", rating);
    formData.append("job", id);
    formData.append(
      "rating",
      state.ratings.filter((c) => c.about == rating)[0].rating
    );
    await FilesService.postFiles(dispatch, formData);
    await AchievmentService.getAchievments(dispatch, id);
    setState({ state: false, value: {} });
  };

  return (
    <div className="w-100  h-[100vh] bg-[#504f4f6c] fixed top-0 flex items-center py-5 justify-center left-0">
      <div className="w-[80%] md:w-[50%]">
        <BoxComponent>
          <h1 className="font-semibold">{state.title}</h1>
          <form action="mt-2" onSubmit={(e) => submitHandler(e)}>
            <input
              type="file"
              onChange={(e) => changeFile(e)}
              className="form-control mt-2"
              required
            />
            <p className="text-[15px]">Yutuq toifasi</p>
            <select
              value={rating}
              className="form-control col-4"
              onChange={(e) => setRating(e.target.value)}
              name=""
              id="rating"
            >
              {state.ratings.map((item) => (
                <option value={item.about}>
                  {item.about} {item.rating} ball
                </option>
              ))}
            </select>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setState({ value: state, state: false })}
                disabled={isLoading}
                className="bg-secondary text-[15px] px-2 py-1 rounded-md text-white"
              >
                Bekor qilish
              </button>
              <button
                disabled={isLoading}
                className="bg-primary px-2 py-1 text-[15px] rounded-md text-white"
              >
                Yuborish
              </button>
            </div>
          </form>
        </BoxComponent>
      </div>
    </div>
  );
};

export default CreateBox;
