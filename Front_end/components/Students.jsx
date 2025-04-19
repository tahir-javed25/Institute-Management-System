import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Students = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getStudents();
  });

  const getStudents = () => {
    axios
      .get("http://localhost:3000/student/all-students", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        // console.log(res.data.students);
        setStudents(res.data.students)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    
    students && students.length>0 && 
    <div className="all-students">
      <h1>All Students </h1> 
      <table className="students-table">
        <thead>
          <tr>
            <th>Picture</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            </tr>
          </thead>
          <tbody>
           {
            students.map((student)=>{
              return (
                <tr key={student._id} onClick={()=>{navigate("/dashboard/student-details/"+student._id)}}>
                  <td><img src={student.stdImgUrl} className="student-img" alt="" width={"100px"}/></td>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.address}</td>
                </tr>
              )})
           }
          </tbody>
      </table>
    </div>
  );
};

export default Students;
