import User from '../models/User';
import * as Yup from 'yup'

class UserController {
  async store(request, response) {

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6)
    })

    if(!(await schema.isValid(request.body))){
      return response.status(400).json({ error: 'Validation fails' })
    }
    const { email, name, password } = request.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return response.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    return response.json(user);
  }
}

export default new UserController();
