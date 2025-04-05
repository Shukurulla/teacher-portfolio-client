import React, { useEffect, useState } from "react";
import BoxComponent from "../../components/box.component";
import UserService from "../../service/user.service";
import { useDispatch, useSelector } from "react-redux";
import FilesService from "../../service/file.service";
import ModalComponent from "../../components/modal.component";
import {
  FiEdit,
  FiUser,
  FiPhone,
  FiSettings,
  FiCheck,
  FiX,
} from "react-icons/fi";

const Profile = () => {
  const { user, isLoading } = useSelector((state) => state.user);
  const { myFiles } = useSelector((state) => state.file);
  const [openModal, setOpenModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [image, setImage] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    UserService.getUser(dispatch);
    FilesService.getFiles(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
      setThumbnail(user.profileImage || "");
      setImage(user.profileImage || "");
    }
  }, [user]);

  const changeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const thumbnail = URL.createObjectURL(file);
      setThumbnail(thumbnail);
      setImage(file);
    }
  };

  const submitHandler = async () => {
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (image instanceof File) {
      formData.append("profileImage", image);
    }

    await UserService.editProfile(dispatch, user._id, formData);
    setOpenModal(false);
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <BoxComponent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </BoxComponent>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Edit Profile Modal */}
      <ModalComponent state={openModal} onClose={() => setOpenModal(false)}>
        <BoxComponent>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold flex items-center">
                <FiUser className="mr-2 text-primary" />
                Profil ma'lumotlarini o'zgartirish
              </h1>
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <label htmlFor="profileImage" className="cursor-pointer">
                  <img
                    src={thumbnail || "/default-avatar.png"}
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                    alt="Profile"
                  />
                  <input
                    type="file"
                    onChange={changeFile}
                    className="hidden"
                    id="profileImage"
                    accept="image/*"
                  />
                </label>
                <label
                  htmlFor="profileImage"
                  className="mt-2 text-sm text-primary font-medium cursor-pointer"
                >
                  Rasmni o'zgartirish
                </label>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ism
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ismingiz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Familiya
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Familiyangiz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon raqam
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Telefon raqam"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium flex items-center"
              >
                <FiX className="mr-1" />
                Bekor qilish
              </button>
              <button
                onClick={submitHandler}
                disabled={!firstName || !lastName || !phone}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md font-medium flex items-center disabled:opacity-50"
              >
                <FiCheck className="mr-1" />
                Saqlash
              </button>
            </div>
          </div>
        </BoxComponent>
      </ModalComponent>

      {/* Profile Content */}
      <BoxComponent>
        <div className="flex flex-col md:flex-row gap-6 p-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img
              src={user?.profileImage || "/default-avatar.png"}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
              alt="Profile"
            />
            <button
              onClick={() => setOpenModal(true)}
              className="mt-4 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md font-medium flex items-center"
            >
              <FiEdit className="mr-2" />
              Tahrirlash
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h1 className="text-2xl font-semibold">
                  {user?.firstName} {user?.lastName}
                </h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <FiPhone className="mr-2" />
                  <span>{user?.phone || "Telefon raqam kiritilmagan"}</span>
                </div>
              </div>

              {/* Progress Section */}
              {/* <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-medium mb-3 flex items-center">
                  <FiSettings className="mr-2 text-primary" />
                  Natijalar
                </h2>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">
                    Umumiy ball: {myFiles?.totalBalls || 0}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.min(
                      Math.floor((myFiles?.totalBalls || 0) / 10) * 10,
                      100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(myFiles?.totalBalls || 0, 100)}%`,
                    }}
                  ></div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </BoxComponent>
    </div>
  );
};

export default Profile;
