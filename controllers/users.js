const { catchAsync } = require('../middlewares/catch');
const userModel = require('../models/User');

const signin = catchAsync(async (req, res) => {
  const { user } = req;
  const info = await userModel.findOne({
    raw: true,
    where: {
      email: user._json.email,
    },
  });
  if (!info) {
    await userModel.create({
      email: user._json.email,
      name: user._json.name || user._json.given_name || user.displayName,
    });
  }
  return res.redirect('../../');
});

module.exports = { signin };
