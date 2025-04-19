import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Students from "./Students";

const AddStudents = () => {
  const [courses, setCourse] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl,setImageUrl] = useState(null);
  const [isLoading,setLoading] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [student, setStudent] = useState(location.state?.student || {
    fullName: "",
    email: "",
    address: "",
    phone: "",
    courseId:"",
  });

  useEffect(()=>{
    getCourses();
    if(location.state){
      setStudent((prev)=> ({...prev, ...location.state.student}))
      setImageUrl(location.state.student.stdImgUrl)
      console.log(location.state)
    }else{
      setStudent({fullName: "", email: "",address:"", phone: "", courseId: ""})
    }
  },[location]) 
  


  const handleInputs = (event) => {
    const { name, value } = event.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    setImage(file);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

// Courses for student to choose in which he wants to enrole
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
        toast.error("Can't access the Courses for Now.....");
      });
  };



  const handleStudent = (event) => {
    setLoading(true)
    event.preventDefault();
    const formData = new FormData();
    Object.keys(student).forEach((key) => {
      formData.append(key, student[key])
    });

    if (image) {
      formData.append("image", image);
    }

    // console.log(student,image,imageUrl)

    if(location.state){
      axios.put("http://localhost:3000/student/"+location.state.student._id,formData, {
        headers:{
          "Authorization" : "Bearer "+localStorage.getItem("token"),
        }
      }).then(res=>{
        setLoading(false)
        console.log(res.data)
        toast.success("Student is Updated.....")
        navigate("/dashboard/student-details/"+location.state.student._id)
      }).catch(error=>{
        setLoading(false)
        console.log(error)
        toast.error("Student can't be updated.....")
      })
  

    }else{

    axios.post("http://localhost:3000/student/add-student",formData, {
      headers:{
        "Authorization" : "Bearer "+localStorage.getItem("token"),
      }
    }).then(res=>{
      setLoading(false)
      console.log(res.data)
      toast.success("Student is Added.....")
      navigate("/dashboard/students")
    }).catch(error=>{
      setLoading(false)
      console.log(error)
      toast.error("Course can'not be Added.....")
    })}


    if(fileRef.current){
      fileRef.current.value="";
    }
      setStudent({fullName:"",email:"",phone:"", address:"",courseId:""});
      setImage(null)
      setImageUrl(null)

  };

  return (
    <>
   
    <div>
      <form action="" className="form" onSubmit={handleStudent}>
      <h1>{location.state? "Edit Student": "Add New Student"}</h1>
        <input type="text" onChange={handleInputs} value={student.fullName} name="fullName" placeholder="Student Name"/>
        <input type="text" onChange={handleInputs} value={student.email} name="email" placeholder="Email" />
       <input type="text" onChange={handleInputs} value={student.address} name="address" placeholder="Address of Student" />
       <input type="text" onChange={handleInputs} value={student.phone} placeholder="Phone" name="phone" />


       <select name="courseId" onChange={handleInputs} value={student.courseId} >
        <option >Select Course</option>
        {courses.map(course=>{
          return <option value={course._id} key={course._id}>{course.courseName}</option>
        })}
       </select>

        <input
          placeholder="Upload Image"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImage}
          required ={!location.state}
          ref={fileRef}
        />
        {imageUrl && <img src={imageUrl} alt="" className="" width={"100px"} />}
        <button type="submmit" className="form-btn">{isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
        {isLoading ? "Submitting... ": "Submit" }</button>
      </form>
    </div>
    </>
  );
};

export default AddStudents;
