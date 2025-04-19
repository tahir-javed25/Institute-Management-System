import { useEffect, useRef, useState } from "react";
import "./styles.css";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export const Login = () => {

  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleUser = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    // there is no need to make object/formData for user useState as we have just two things to here so we can directly use the user object here.

    axios.post("http://localhost:3000/user/login",user,{
      headers: {
        "Content-Type": "application/json"
      }})
    .then(res=>{
      console.log(res.data)
      localStorage.setItem("fullName",res.data.fullName)
      localStorage.setItem("email",res.data.email)
      localStorage.setItem("token",res.data.token)
      localStorage.setItem("imageId",res.data.imageId)
      localStorage.setItem("imageUrl",res.data.imageUrl)
      localStorage.setItem("id",res.data._id)
      navigate("/dashboard")
      setLoading(false)
      toast.success("Logged In Successfully");
      })
    .catch(err=>{
      // console.log(err.response.data.error)
      setLoading(false);
      toast.error("Something Went Wrong")
      })
      
    setUser({ email: "",password: "",})
  };

  return (
    <>
      <div className="sign-up-div">
        <div className="sign-up-page">
          <div className="sign-up-left">
            <img src="../src/assets/android--.png" alt="Website logo" />
            <h1>Institute Managemenet System</h1>
            <p>Manage your Institute's Data</p>
          </div>

          <div className="sign-up-right">
            <h2>Login With your Account</h2>
            <form action="" method="post" onSubmit={handleSubmit} className="form">
              <input
                placeholder="Enter Email"
                value={user.email}
                type="email"
                name="email"
                onChange={handleUser}
                required
              />
              <input
                placeholder="Enter Secure Password"
                value={user.password}
                type="password"
                name="password"
                onChange={handleUser}
                required
              />
              <button type="submit"> {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
              {isLoading? "Submitting... ": "Submit" }</button>
            </form>
            <div>
                <p>Don't Have Account? <a className="link" href="./Signup">Sing up</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
