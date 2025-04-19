import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const AddCourses = () => {
  const [thumbNail, setThumbNail] = useState(null);
  const [thumbNailUrl, setThumbNailUrl] = useState(null);
  const [isLoading,setLoading] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(location.state?.course || {
    courseName: "",
    description: "",
    prise: "",
    startDate: "",
    endDate: "",
  });

  useEffect(()=>{
// In case of editing the course...... if the location is update in params
    if(location.state){
      setCourse((prev)=> ({...prev, ...location.state.course}))
      setThumbNailUrl(location.state.course.thumbNailUrl)
      // console.log(location.state)
    }else{
      setCourse({courseName: "", description: "",prise:"", startDate: "", endDate: ""})
    }

  },[location])     //this location in dependency array ensures that when we are updating the course, it will not highlight the Add course button,

// in case of New course
  const handleInputs = (event) => {
    const { name, value } = event.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    setThumbNail(file);
    const url = URL.createObjectURL(file);
    setThumbNailUrl(url);
  };

  const handleCourse = (event) => {
    setLoading(true)
    event.preventDefault();
    const formData = new FormData();
    Object.keys(course).forEach((key) => {
      formData.append(key, course[key])
    });

    if (thumbNail) {
      formData.append("thumbNail", thumbNail);
    }


    if(location.state){
      axios.put("http://localhost:3000/course/"+location.state.course._id,formData, {
        headers:{
          "Authorization" : "Bearer "+localStorage.getItem("token"),
        }
      }).then(res=>{
        setLoading(false)
        console.log(res.data)
        toast.success("Course is Updated.....")
        navigate("/dashboard/course-details/"+location.state.course._id)
      }).catch(error=>{
        setLoading(false)
        console.log(error)
        toast.error("Course can'not be Update Course.....")
      })
      
    }else {axios.post("http://localhost:3000/course/add-course",formData, {
      headers:{
        "Authorization" : "Bearer "+localStorage.getItem("token"),
      }
    }).then(res=>{
      setLoading(false)
      console.log(res.data)
      toast.success("Course is Added.....")
      navigate("/dashboard/courses")
    }).catch(error=>{
      setLoading(false)
      console.log(error)
      toast.error("Course can'not be Added.....")
    })}
    
    
    if(fileRef.current){
      fileRef.current.value="";
    }
    setCourse({courseName: "", description: "",prise:"", startDate: "", endDate: ""});
      setThumbNail(null)
      setThumbNailUrl(null)

  };

  return (
    <>
   
    <div>
      <form action="" className="form" onSubmit={handleCourse}>
      <h1>{location.state ? "Edit Course" : "Add New Course"}</h1>
        <input
          type="text"
          value={course.courseName}
          name="courseName"
          placeholder="Course Name"
          onChange={handleInputs}
          required
        />
        <input
          type="text"
          value={course.description}
          name="description"
          placeholder="Description"
          onChange={handleInputs}
          required
        />
        <input
          type="number"
          value={course.prise}
          name="prise"
          placeholder="Price"
          onChange={handleInputs}
          required
        />
        <input
          type="text"
          value={course.startDate}
          name="startDate"
          placeholder="Starting Date (DD-MM-YYYY)"
          onChange={handleInputs}
          required
        />
        <input
          type="text"
          value={course.endDate}
          name="endDate"
          placeholder="Ending Date (DD-MM-YYYY)"
          onChange={handleInputs}
          required
        />
        <input
          placeholder="Upload Image"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImage}
          required={!location.state}
          ref={fileRef}
        />
        {thumbNailUrl && <img src={thumbNailUrl} alt="" className="" width={"100px"} />}
        <button type="submmit" className="form-btn">{isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
        {isLoading ? "Submitting... ": "Submit" }</button>
      </form>
    </div>
    </>
  );
};

export default AddCourses;
