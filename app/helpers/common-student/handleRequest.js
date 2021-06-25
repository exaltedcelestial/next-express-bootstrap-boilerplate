// validate body before sending
import Joi from 'joi';

const validate = (params) => {
  const emailSchema = Joi.object({
    tutor: Joi.alternatives().try(
      Joi.string().email(),
      Joi.array().items(Joi.string().email()).min(2)
    ).required(),
  }).required();
  const { error } = emailSchema.validate(params);

  return !error;
};

// instance is instance of axios connector
function attachInterceptor(instance) {
  if (!instance) return instance;
  instance.interceptors.response.use((req) => {
    const { params = {} } = req;

    if (!validate(params)) return Promise.reject(new Error('Tutor must be an email'));
    return req;
  }, (err) => Promise.reject(err));
  return instance;
}

export default attachInterceptor;
