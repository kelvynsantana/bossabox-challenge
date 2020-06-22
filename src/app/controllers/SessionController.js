import User from '../models/User';

class SessionController {
  async store(request, response) {
    const { email, password } = request.body;

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(400).json('Email or password incorrect.');
    }

    if (!(await user.compareHash(password))) {
      return response.status(400).json('Email or password incorrect.');
    }

    return response.json({ user, token: User.generateToken(user) });
  }
}

export default new SessionController();
