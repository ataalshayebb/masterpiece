// controllers/friendController.js
const User = require('../models/users');

// controllers/friendController.js

exports.sendFriendRequest = async (req, res) => {
  console.log('sendFriendRequest function called');
  console.log('Request body:', req.body);
  console.log('User ID from token:', req.user.id);

  try {
    const { friendId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if a friend request already exists or if they are already friends
    const existingRequest = user.friends.find(f => f.userId.toString() === friendId);
    if (existingRequest) {
      if (existingRequest.isFriend) {
        return res.status(400).json({ message: 'You are already friends with this user' });
      } else {
        return res.status(400).json({ message: 'Friend request already sent' });
      }
    }

    // Add the friend request to the receiver's friends array only
    friend.friends.push({ userId: userId, isFriend: false });

    await friend.save();

    console.log('Friend request sent successfully');
    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error('Error in sendFriendRequest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.acceptFriendRequest = async (req, res) => {
  console.log('acceptFriendRequest function called');
  console.log('Request body:', req.body);
  console.log('User ID from token:', req.user.id);

  try {
    const { friendId } = req.body;
    const userId = req.user.id;

    console.log('Looking for user with ID:', userId);
    const user = await User.findById(userId);
    console.log('Looking for friend with ID:', friendId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      console.log('User or friend not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User friends:', user.friends);
    console.log('Friend friends:', friend.friends);

    // Check if the friend request exists
    let friendRequest = user.friends.find(f => f.userId.toString() === friendId && !f.isFriend);

    if (!friendRequest) {
      console.log('Friend request not found');
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Update the friendship status for both users
    friendRequest.isFriend = true;
    friend.friends.push({ userId: userId, isFriend: true });

    console.log('Saving updated user and friend documents');
    await user.save();
    await friend.save();

    console.log('Friend request accepted successfully');
    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Error in acceptFriendRequest:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.rejectFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.friends = user.friends.filter(f => f.userId.toString() !== friendId);
    await user.save();

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.friends = user.friends.filter(f => f.userId.toString() !== friendId);
    friend.friends = friend.friends.filter(f => f.userId.toString() !== userId);

    await user.save();
    await friend.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('friends.userId', 'username image');

    const friends = user.friends.filter(f => f.isFriend).map(f => ({
      _id: f.userId._id,
      username: f.userId.username,
      image: f.userId.image
    }));

    res.json(friends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('friends.userId', 'username image');

    const friendRequests = user.friends.filter(f => !f.isFriend).map(f => ({
      _id: f.userId._id,
      username: f.userId.username,
      image: f.userId.image
    }));

    res.json(friendRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSentRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await User.find({ 'friends.userId': userId, 'friends.isFriend': false })
      .select('_id username image');

    const sentRequests = users.map(user => ({
      _id: user._id,
      username: user.username,
      image: user.image
    }));

    res.json(sentRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// In your userController.js or a new file like suggestionController.js

exports.getUserSuggestions = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Current user:', currentUser._id);
    console.log('Current user city:', currentUser.city);
    console.log('Current user level:', currentUser.level);

    const friendIds = currentUser.friends.map(friend => friend.userId.toString());
    console.log('Friend IDs:', friendIds);

    // First, try to find users with both matching city and level
    let suggestions = await User.find({
      _id: { $ne: currentUser._id.toString(), $nin: friendIds },
      city: currentUser.city,
      level: currentUser.level
    }).limit(10).select('username image level city title');

    // If no suggestions found, try to find users with either matching city or level
    if (suggestions.length === 0) {
      suggestions = await User.find({
        _id: { $ne: currentUser._id.toString(), $nin: friendIds },
        $or: [
          { city: currentUser.city },
          { level: currentUser.level }
        ]
      }).limit(10).select('username image level city title');
    }

    // If still no suggestions, find any users (except friends and self)
    if (suggestions.length === 0) {
      suggestions = await User.find({
        _id: { $ne: currentUser._id.toString(), $nin: friendIds }
      }).limit(10).select('username image level city title');
    }

    console.log('Suggestions found:', suggestions.length);
    console.log('Suggestion IDs:', suggestions.map(s => s._id));

    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching user suggestions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};