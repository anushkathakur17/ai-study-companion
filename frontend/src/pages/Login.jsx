import { useState } from "react";

import api from "../services/api";

import { useNavigate, Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    email:"",

    password:""

  });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:e.target.value

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await api.post(

        "/users/login",

        formData

      );

      localStorage.setItem(

        "token",

        res.data.access_token

      );

      navigate(

        "/dashboard"

      );

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

        Login

      </h3>

      <form onSubmit={handleSubmit}>

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

          Login

        </button>

      </form>

      <div className="auth-link">

        <Link to="/register">

          Don't have an account? Register

        </Link>

      </div>

    </div>

  );

}

export default Login;