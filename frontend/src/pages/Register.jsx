import { useState } from "react";

import api from "../services/api";

import {

  useNavigate,

  Link

} from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [formData,setFormData]=useState({

    name:"",

    email:"",

    password:""

  });

  const handleChange=(e)=>{

    setFormData({

      ...formData,

      [e.target.name]:

      e.target.value

    });

  };

  const handleSubmit=async(e)=>{

    e.preventDefault();

    try{

      await api.post(

        "/users/register",

        formData

      );

      alert(

        "Registration successful"

      );

      navigate("/");

    }

    catch(err){

      alert(

        err.response.data.detail

      );

    }

  };

  return (

    <div className="auth-card">

      <h1>

        AI Study Companion

      </h1>

      <h3>

        Create Account

      </h3>

      <form onSubmit={handleSubmit}>

        <input

          type="text"

          name="name"

          placeholder="Name"

          onChange={handleChange}

        />

        <br /><br />

        <input

          type="email"

          name="email"

          placeholder="Email"

          onChange={handleChange}

        />

        <br /><br />

        <input

          type="password"

          name="password"

          placeholder="Password"

          onChange={handleChange}

        />

        <br /><br />

        <button type="submit">

          Register

        </button>

      </form>

      <div className="auth-link">

        <Link to="/">

          Already have an account? Login

        </Link>

      </div>

    </div>

  );

}

export default Register;