import User from '../models/User';

class UserController {
  async store(request, response) {
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
