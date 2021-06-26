import React, { useContext, useEffect, useCallback, useState } from 'react';
import { AppContext } from './App';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
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

        setLastTutor(values.tutor);
        const response = await customInstance.get('/api/getcommonsstudents', { params: { tutor: values.tutor } });
        const { data = {} } = response;
        const { students: recipients = [] } = data;
        setStudents(recipients);
        setLoading(false);
      } catch (error) {
        console.log(error)        
      }
    },
  });
  const sameTutor = formik.values.tutor === lastTutor;
  const blankTutor = !formik.values.tutor.trim();

  return (
    <>
      <div className='common-students'>
        <span className='common-students-header'>
          <h2>
            Student List
          </h2>
        </span>
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
                if (!loading) return 'Search Students'
                return (
                  <>
                    <i className='spinner-border text-light spinner-border-sm' /> Fetching results
                  </>
                );
              })()}
            </Button>
          </Form>
        </div>
        <div className="common-students-search">
          {JSON.stringify(students)}
        </div>
      </div>
    </>
  );
};

export default CommonStudent;
