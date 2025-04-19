import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Fee = () => {
  const[isLoading, setLoading] = useState(false);
  const [courses, setCourse] = useState([]);
  const [fee, setFee] =useState({
    fullName:"",
    phone:"",
    amount:"",
    remarks:"",
    courseId:"",
  })

const handleInputs=(event)=>{
  const {name, value} = event.target;
  setFee(fee=>({...fee, [name]: value}));
}

  useEffect(() => {
    getCourses();
  },[]);

  const getCourses = () => {
    axios
      .get("http://localhost:3000/course/all-courses", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        // console.log(res.data.courses);
        setCourse(res.data.courses);
      })
      .catch((error) => {
        // setLoading(false)
        // console.log(error)
        // toast.error("Can't access the Courses for Now.....");
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(fee).forEach(key => {
      formData.append(key, fee[key]); 
    });
    
    axios
      .post("http://localhost:3000/fee/add-fee",formData,{
        headers:{
          "Authorization" : "Bearer "+localStorage.getItem("token"),
        }
      })
      .then((res) => {
        setLoading(false)
        console.log(res.data);
        toast.success("Fee Paid Successfully");
      })
      .catch((error) => {
        setLoading(false)
        toast("Can't pay the fee Right Now");
      });
  };
  return (
    <>
      <form action="" method="post" onSubmit={handleSubmit} className="form">
        <input
          placeholder="Enter Full Name"
          value={fee.fullName}
          type="text"
          name="fullName"
          onChange={handleInputs}
          required
        />
        <input
          placeholder="Enter Phone Number"
          value={fee.phone}
          type="tel"
          name="phone"
          onChange={handleInputs}
          required
        />

        <select
          name="courseId"
          onChange={handleInputs}
          value={fee.courseId}
        >
          <option>Select Course</option>
          {courses.map((course) => {
            return (
              <option value={course._id} key={course._id}>
                {course.courseName}
              </option>
            );
          })}
        </select>

        <input
          placeholder="Amount"
          value={fee.amount}
          type="number"
          name="amount"
          onChange={handleInputs}
          required
        />
        <input
          placeholder="Remarks"
          value={fee.remarks}
          type="text"
          name="remarks"
          onChange={handleInputs}
          required
        />

        <button type="submit">
          {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
          {isLoading ? "Submitting... " : "Submit"}
        </button>
      </form>
    </>
  );
};

export default Fee;
