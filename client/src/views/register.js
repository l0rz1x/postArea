import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./styles/register.css";
import { useNavigate } from "react-router-dom";

function Register() {
  let navigate = useNavigate();
  const initialValues = {
    userName: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    userName: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });
  const onSubmit = (data) => {
    axios.post("http://localhost:3000/auth", data).then(() => {
      navigate("/login");
    });
  };
  return (
    <div className="Register">
      <h1>Register</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="reg-formContainer">
          <label htmlFor="reg-userName">Username: </label>
          <ErrorMessage name="userName" component="span" />
          <Field
            id="reg-userName"
            name="userName"
            placeholder="(Ex. JHon-cena)"
          />
          <label htmlFor="reg-password">Password: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            id="reg-password"
            name="password"
            type="password"
            placeholder="(Ex. password...)"
          />
          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Register;
