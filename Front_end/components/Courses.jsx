import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = () => {
    axios
      .get("http://localhost:3000/course/all-courses", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data.courses);
        setCourses(res.data.courses);
      })
      .catch((error) => {
        // setLoading(false)
        // console.log(error)
        toast.error("Can't access the Courses for Now.....");
      });
  };
  return (
    <>
      <ul className="wraper"> 
        {courses.map((course) => {
          return (
            <li className="course-item" key={course._id} onClick={()=>{navigate("/dashboard/course-details/"+course._id)}}>
              <img src={course.thumbNailUrl} alt="Course Thumb Nail" className="course-thumbnail" />
             
              <div className="course-data">
                <h2>{course.courseName}</h2>
                <p>Rs. {course.prise} only</p>
              </div>
              <div className="duration">
                  <p><b>Start:</b> {course.startDate.split("T")[0]}</p>
                  <p><b>End:</b> {course.endDate.split("T")[0]}</p>
                </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Courses;
