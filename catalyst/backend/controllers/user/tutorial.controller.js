const User = require('../../models/user.model');

const completeTutorial = async (req, res) => {
  try {
    const userId = req.user._id;
    const { completedSteps, completed } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.tutorialCompleted = completed !== undefined ? completed : true;
    user.tutorialData = {
      completedSteps: completedSteps || [],
      lastViewed: new Date(),
      skipped: false
    };

    await user.save();

    res.json({ 
      msg: 'Tutorial completed successfully',
      tutorialCompleted: user.tutorialCompleted 
    });
  } catch (error) {
    console.error('Error completing tutorial:', error);
    res.status(500).json({ msg: 'Error completing tutorial', error: error.message });
  }
};

const skipTutorial = async (req, res) => {
  try {
    const userId = req.user._id;
    const { skipped } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.tutorialCompleted = true;
    user.tutorialData = {
      completedSteps: [],
      lastViewed: new Date(),
      skipped: skipped !== undefined ? skipped : true
    };

    await user.save();

    res.json({ 
      msg: 'Tutorial skipped',
      tutorialCompleted: user.tutorialCompleted 
    });
  } catch (error) {
    console.error('Error skipping tutorial:', error);
    res.status(500).json({ msg: 'Error skipping tutorial', error: error.message });
  }
};

module.exports = {
  completeTutorial,
  skipTutorial
};

