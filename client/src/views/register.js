import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./styles/register.css";

function Register() {
  const initalValues = {
    userName: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    userName: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });
  const onSubmit = (data) => {
    axios.post("http://localhost:3000/auth", data).then(() => {
      console.log(data);
    });
  };
  return (
    <div className="Register">
      <Formik
        initialValues={initalValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="reg-formContainer">
          <label htmlFor="reg-userName">Username: </label>
          <ErrorMessage name="reg-userName" component="span" />
          <Field
            id="reg-userName"
            name="reg-userName"
            placeholder="(Ex. JHon-cena)"
          />
          <label htmlFor="reg-password">Password: </label>
          <ErrorMessage name="reg-password" component="span" />
          <Field
            id="reg-password"
            name="reg-password"
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
