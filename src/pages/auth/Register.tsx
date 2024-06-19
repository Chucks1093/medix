import "./auth.scss";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../components/authentication/form-input/FormInput";
import { Fragment, useState } from "react";
import { useSearchParams } from "react-router-dom";
import showToast from "../../utils/showToast";
import useCurrentUser from "../../hooks/useCurrentUser";
import Loader from "../../components/shared/loader/circle-loader/Loader";
import Cookies from "js-cookie";

interface RegistrationResponse {
  success: boolean;
  data: {
    username: string;
    email: string;
    type: string;
    password: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    accessToken: string;
    __v: number;
  };
  message: string;
}

function Register() {
  const [searchParam, setSearchParam] = useSearchParams();
  const { setCurrentUser } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: searchParam.get("name") ?? "",
    email: searchParam.get("email") ?? "",
    password: "",
  });

  const [policy, setPolicy] = useState(false);

  const navigate = useNavigate();

  const changePolicy = () => {
    setPolicy(!policy);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((newUserData) => ({
      ...newUserData,
      [name]: value,
    }));
    if (name !== "password") {
      setSearchParam({
        ...searchParam,
        name: newUser.name,
        email: newUser.email,
        [name]: value,
      });
    }
  };

  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUser.name,
          email: newUser.email,
          password: newUser.password,
        }),
      });
      const result = (await resp.json()) as RegistrationResponse;

      if (!resp.ok) {
        console.log(result);
        showToast.error(result.message);
        throw new Error(result.message);
      }
      Cookies.set("doctor-token", result.data.accessToken, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });

      setCurrentUser(result.data);
      showToast.success("Successfully Registered");
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        showToast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Fragment>
      <div className="auth__cover" onClick={handleCancel} />
      <div className="auth__modal">
        <button className="cancel__btn" onClick={handleCancel}>
          <img src="/icons/cancel.svg" alt="" />
        </button>
        <div className="logo__container">
          <img src="/icons/logo.svg" />
          <p>Medix</p>
        </div>
        <form onSubmit={handelSubmit}>
          <FormInput
            name="name"
            type="text"
            label
            id="name"
            handleChange={handleChange}
            value={newUser.name}
            required
          />
          <FormInput
            name="email"
            type="email"
            label
            id="email"
            handleChange={handleChange}
            value={newUser.email}
            required
          />
          <FormInput
            name="password"
            type="password"
            label
            id="password"
            handleChange={handleChange}
            value={newUser.password}
            eyeicon
            required
          />
          <div className="policy__container">
            <input
              type="radio"
              className="policy"
              id="policy"
              checked={policy}
              onClick={changePolicy}
            />
            <label className="policy__label" htmlFor="policy">
              By opening an account you agree to the terms and conditions of our{" "}
              <Link to="/">privacy policy</Link>
            </label>
          </div>
          <button className="submit__btn">
            {loading ? <Loader /> : "Submit"}
          </button>
          <label className="policy__label" htmlFor="policy">
            Already have an account ? <Link to="/login">SIGN IN</Link>
          </label>
        </form>
      </div>
    </Fragment>
  );
}
export default Register;
