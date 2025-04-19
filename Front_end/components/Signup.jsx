import { useEffect, useRef, useState } from "react";
import "./styles.css";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [image, setImage] = useState(null);
  const [imageUrl,setImageUrl] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputFileRef = useRef(null);
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleUser = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  

  useEffect(() => {
    console.log("Current imageUrl:", imageUrl);
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl); // Clean up the previous URL
      }
    };
  }, [imageUrl]); 

  const handleImage = (event) => {
    
      const file = event.target.files[0];
      if (file) {
         setImage(file); // Update the image state
        const url = URL.createObjectURL(file); // Generate a Blob URL directly
        setImageUrl(url); // Set it for image preview
      }
    // setImage(file);
    // const url = URL.createObjectURL(file);
    // // console.log(url);
    // setImageUrl(url);
  
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.keys(user).forEach(key=>{
      formData.append(key,user[key])
    })

    if(image){
    formData.append("image", image);
    }

    // console.log(formData);

    axios.post("http://localhost:3000/user/signup",formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }})
    .then(res=>{
      // console.log(res)
      navigate("/login")
      setLoading(false)
      toast.success("You'r Account is Created");
      })
    .catch(err=>{
      // console.log(err.response.data.error)
      setLoading(false);
      toast.error(err.response.data.error)
      })

    // console.log(user,image);
    setUser({fullName: "", email: "",password: "", phone: ""})
    setImage(null)
    setImageUrl(null)

    if (inputFileRef.current) {
      inputFileRef.current.value = ""; // This clears the file input
    }

    
    
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
            <h2>Create Your Account</h2>
            <form action="" method="post" onSubmit={handleSubmit} className="form">
              <input
                placeholder="Enter User Name"
                value={user.fullName}
                type="text"
                name="fullName"
                onChange={handleUser}
                required
                
              />
              <input
                placeholder="Enter Email"
                value={user.email}
                type="email"
                name="email"
                onChange={handleUser}
                required
              />
              <input
                placeholder="Enter Phone Number"
                value={user.phone}
                type="phone"
                name="phone"
                onChange={handleUser}
                required
              />
              <input
                placeholder="Upload Image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImage}
                required
                ref={inputFileRef}
              />
              <input
                placeholder="Enter Secure Password"
                value={user.password}
                type="password"
                name="password"
                onChange={handleUser}
                required
              />
              {imageUrl && <img src={imageUrl} alt="Uploaded Profile" className="profile" />}
              <button type="submit"> {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
              {isLoading? "Submitting... ": "Submit" }</button>
            </form>
            <div>
                <p>Have Account? <a className="link" href="./Login">Sing In</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
