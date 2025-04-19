import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../../service/user.service";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading } = useSelector((state) => state.user);
  const [regions, setRegions] = useState([]);
  const [province, setProvince] = useState("");

  useEffect(() => {
    const provinces = async () => {
      const provinces = await UserService.getProvinces();
      setRegions(provinces.data);
      return provinces;
    };
    provinces();
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const postHandler = async (e) => {
    e.preventDefault();
    console.log(province);

    const userSchema = {
      firstName,
      lastName,
      phone,
      password,
      province,
    };
    await UserService.postUser(dispatch, userSchema, navigate);
    window.location.reload();
  };

  return (
    <main className="lg:w-[30%] w-[90%] my-5 py-5 mx-auto">
      <form onSubmit={(e) => postHandler(e)}>
        <h1 className="h3 mb-3 fw-normal">Ro'yhatdan otish</h1>

        <div className="">
          <input
            type="text"
            className="form-control py-1"
            id="floatingInput"
            placeholder="Ismingiz"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="my-2">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder="Familiyangiz"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder="Telefon raqam"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="my-2">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="my-2">
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="form-control"
          >
            {regions.map((item) => (
              <option value={item.title}>{item.title}</option>
            ))}
          </select>
        </div>

        <button
          disabled={isLoading}
          className="w-100 btn  btn-primary"
          type="submit"
        >
          {isLoading ? "Yuborilmoqda..." : "Yuborish"}
        </button>
        <p className="mt-2">
          Oldin ro'yhantdan otganmisiz?{" "}
          <Link to={"/auth/login"} className="text-primary">
            Kirish
          </Link>
        </p>
      </form>
    </main>
  );
};

export default RegisterPage;
