import React, { useContext, useEffect, useCallback, useState } from 'react';
import { AppContext } from './App';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import Spinner from 'react-bootstrap/Spinner'
import Joi from 'joi';
import Table from 'react-bootstrap/Table'
import attachInterceptor from '../helpers/common-student/handleRequest';
import '../styles/CommonStudent.scss';

const CommonStudent = () => {
  const context = useContext(AppContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastTutor, setLastTutor] = useState('');

  const { fetchAPI } = context;
  const customInstance = attachInterceptor(fetchAPI);
  const schema = Joi.object({
    tutor: Joi.alternatives().try(
      Joi.string().email({ tlds: { allow: false } }),
      Joi.array().items(Joi.string().email({ tlds: { allow: false } })).min(2)
    ).required(),
  }).required();
  const formik = useFormik({
    initialValues: {
      tutor: '',
    },
    onSubmit: async (values, { setErrors }) => {
      try {
        setLoading(true)
        const { error } = schema.validate(values)
        if (error) {
          const { details = [] } = error;
          const errors = details.reduce((mem, detail) => {
            const { message, context: { key } } = detail;
            return Object.assign(mem, { [key]: message });
          }, {})

          setErrors(errors)
          return;
        }
        function delay(t) {
          return new Promise((resolve) => {
            setTimeout(resolve, t)
          })
        }
        setLastTutor(values.tutor);
        const response = await customInstance.get('/api/getcommonsstudents', { params: { tutor: values.tutor } });
        const { data = {} } = response;
        const { students: recipients = [] } = data;
        setStudents(recipients);
      } catch (error) {
        console.log(error)        
      } finally {
        setLoading(false);
      }
    },
  });
  const sameTutor = formik.values.tutor === lastTutor;
  const blankTutor = !formik.values.tutor.trim();

  return (
    <>
      <div className='common-students'>
        <div className='common-students-header'>
          Student List
        </div>
        <div className="common-students-search">
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="tutor"
                type="email"
                placeholder="Enter teacher's email"
                value={formik.values.tutor}
                onChange={formik.handleChange}
                isInvalid={formik.errors.tutor}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.tutor}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Submit to search for student's enrolled to teacher
              </Form.Text>
            </Form.Group>

            <Button className="submit-button" variant="primary" type="submit" disabled={loading || sameTutor || blankTutor}>
              {(()=> {
                if (sameTutor  && !blankTutor) return 'Already Searched'
                return 'Search Students'
                /*
                  return (
                    <>
                      <i className='spinner-border text-light spinner-border-sm' /> Fetching results
                    </>
                  );
                */
              })()}
            </Button>
          </Form>
        </div>
        <div className="common-students-table">
          {(() => {
            if (loading) {
              return (
                <>
                  <div className='spinner-wrapper'>
                    <div className='spinner-border text-primary spinner-border'>
                    </div>
                  </div>
                </>
              );
            }
            if (students.length < 1) {
              if (!lastTutor) return null
              return (
                <div className='no-students'>
                  <h2>
                    No students for this teacher.
                  </h2>
                </div>
              );
            }
            return (
              <>
                <Table className="student-table" striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Teacher</th>
                      <th>Student</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, i) => {
                      let firstColumn = <></>;

                      if (i === 0) {
                        firstColumn = (
                          <td rowSpan={students.length}>
                            {lastTutor}
                          </td>
                        );
                      }
                      return (
                        <tr>
                          {firstColumn}
                          <td>{student}</td>
                        </tr>
                      )
                    })};
                  </tbody>
                </Table>
              </>
            );
          })()}
        </div>
      </div>
    </>
  );
};

export default CommonStudent;
