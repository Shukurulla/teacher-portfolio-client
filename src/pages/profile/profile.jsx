import React, { useEffect, useState } from "react";
import BoxComponent from "../../components/box.component";
import UserService from "../../service/user.service";
import { useDispatch, useSelector } from "react-redux";
import FilesService from "../../service/file.service";
import ModalComponent from "../../components/modal.component";

const Profile = () => {
  const { user, isLoading } = useSelector((state) => state.user);
  const { myFiles } = useSelector((state) => state.file);
  const [openModal, setOpenModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setPhone(user.phone);
      setThumbnail(user.profileImage);
      setImage(user.profileImage);
    }
  }, [user]);

  const dispatch = useDispatch();
  useEffect(() => {
    UserService.getUser(dispatch);
    FilesService.getFiles(dispatch);
  }, []);

  const changeFile = (e) => {
    const file = e.target.files[0];
    const thumbnail = URL.createObjectURL(file);
    setThumbnail(thumbnail);
    setImage(file);
  };

  const submitHandler = async () => {
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("profileImage", image);

    await UserService.editProfile(dispatch, user._id, formData);
    setOpenModal(false);
  };

  return isLoading ? (
    ""
  ) : (
    <div>
      <ModalComponent state={openModal}>
        <div className="w-100 h-100 flex items-center justify-center">
          <div className="w-[70%]">
            <BoxComponent>
              <h1 className="text-xl font-[600]">
                Profil malumotlarini ozgartirish
              </h1>
              <div className="mt-4">
                <div className="row">
                  <div className="col-6 ">
                    <label htmlFor="profileImage">Profil rasmi</label>
                    <label
                      htmlFor="profileImage"
                      className="my-2 flex items-center justify-center"
                    >
                      <img
                        src={thumbnail}
                        className="w-[150px] h-[150px]"
                        alt=""
                      />
                      <input
                        type="file"
                        onChange={(e) => changeFile(e)}
                        className="hidden"
                        id="profileImage"
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <div className="col-6">
                    <div className="mb-2">
                      <label htmlFor="firstName">Ismingiz</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="form-control"
                        id="firstName"
                        placeholder="Ismingiz"
                      />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="lastName">Familiyangiz</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="form-control"
                        id="lastName"
                        placeholder="Familiyangiz"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="phone">Telefon raqam</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-control"
                        id="phone"
                        placeholder="Telefon raqam"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    className="btn btn-primary mr-3"
                    onClick={() => submitHandler()}
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
              </div>
            </BoxComponent>
          </div>
        </div>
      </ModalComponent>
      <div className="p-4">
        <BoxComponent>
          <div className="row">
            <div className="col-3">
              <div className="w-[70%] mx-auto">
                <img src={user.profileImage} alt="" />
              </div>
            </div>
            <div className="col-9">
              <div className="flex w-100 py-3 items-start justify-between">
                <div className="user-info w-[50%]">
                  <h1 className="text-[20px] flex items-center justify-between gap-4 font-semibold">
                    {" "}
                    <span>Ismingiz: </span>
                    <span className="text-[17px]"> {user?.firstName}</span>
                  </h1>
                  <h1 className="text-[20px] flex items-center justify-between gap-2 font-semibold py-3">
                    <span>Familiyangiz: </span>
                    <span className="text-[17px]">{user?.lastName}</span>
                  </h1>
                  <h1 className="text-[20px] flex items-center justify-between gap-2 font-semibold">
                    <span>Telefon raqam:</span>
                    <span className="text-[17px]"> {user?.phone} </span>
                  </h1>
                </div>
                <div className="action w-[40%] text-end pr-3">
                  <button onClick={() => setOpenModal(true)}>
                    <i className="bi text-[20px] bi-gear"></i>
                  </button>
                  <div className="score mt-3">
                    <p>Natija: {myFiles.totalBalls} ball</p>
                    <div className="progress">
                      <div
                        className={`bg-blue-600 w-[${myFiles.totalBalls}%]`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BoxComponent>
      </div>
    </div>
  );
};

export default Profile;
