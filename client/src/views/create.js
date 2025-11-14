import "./styles/create.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Create() {
  let navigate = useNavigate();
  const initalValues = {
    title: "",
    PostText: "",
    userName: "",
  };
  const onSubmit = (data) => {
    axios.post("http://localhost:5000/posts", data).then((response) => {
      navigate("/");
    });
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    PostText: Yup.string().required(),
    userName: Yup.string().min(3).max(15).required(),
  });
  return (
    <div className="createPostPage">
      <Formik
        initialValues={initalValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label htmlFor="inputCreatePost">Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. title..)"
          />
          <label htmlFor="inputCreatePost">PostText: </label>
          <ErrorMessage name="PostText" component="span" />
          <Field
            id="inputCreatePost"
            name="PostText"
            placeholder="(Ex. one day...)"
          />
          <label htmlFor="inputCreatePost">Username: </label>
          <ErrorMessage name="userName" component="span" />
          <Field
            id="inputCreatePost"
            name="userName"
            placeholder="(Ex. JHon-cena)"
          />
          <button type="submit">Create A Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Create;
