import User from '../models/User';

class UserController {
  async store(request, response) {
    const userExists = await User.findOne({ email: request.body.email });

    if (userExists) {
      return response.status(400).json({ error: 'User already exists' });
    }

    const { email, name } = await User.create(request.body);
    return response.json({ name, email });
  }
}

export default new UserController();
