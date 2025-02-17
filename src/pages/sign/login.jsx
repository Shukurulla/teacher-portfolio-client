import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../../service/user.service";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const postHandler = async (e) => {
    e.preventDefault();
    const userSchema = {
      phone,
      password,
    };
    await UserService.loginUser(dispatch, userSchema, navigate);
  };

  return (
    <main className="lg:w-[30%] w-[90%] my-5 py-5 mx-auto">
      <form onSubmit={(e) => postHandler(e)}>
        <h1 className="h3 mb-3 fw-normal">Profilga Kirish</h1>

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

        <button
          disabled={isLoading}
          className="w-100 btn  btn-primary"
          type="submit"
        >
          {isLoading ? "Yuborilmoqda..." : "Yuborish"}
        </button>
        <p className="mt-2">
          Oldin ro'yhantdan otmaganmisiz?{" "}
          <Link to={"/auth/register"} className="text-primary">
            Ro'yhatdan o'tish
          </Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
