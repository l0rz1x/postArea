import "./styles/create.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Create() {
  let navigate = useNavigate();
  const initalValues = {
    title: "",
    PostText: "",
  };
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);
  const onSubmit = (data) => {
    axios
      .post("https://postarea.onrender.com/posts", data, {
        headers: { accesstoken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    PostText: Yup.string().required(),
  });
  return (
    <div className="createPostPage">
      <Formik
        initialValues={initalValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              color: "var(--primary-dark)",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            Create a New Post
          </h1>

          <label htmlFor="inputCreateTitle">Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            id="inputCreateTitle"
            name="title"
            type="text"
            placeholder="Ex. A compelling title for your content"
          />
          <label htmlFor="inputCreatePostText">PostText: </label>
          <ErrorMessage name="PostText" component="span" />
          <Field
            as="textarea"
            id="inputCreatePostText"
            name="PostText"
            placeholder="Ex. Write the full content of your post here..."
          />

          <button type="submit">Create A Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Create;
