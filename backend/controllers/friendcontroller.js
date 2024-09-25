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
  
      if (user.friends.some(f => f.userId.toString() === friendId)) {
        return res.status(400).json({ message: 'Friend request already sent or user is already a friend' });
      }
  
      user.friends.push({ userId: friendId, isFriend: false });
      friend.friends.push({ userId: userId, isFriend: false });
  
      await user.save();
      await friend.save();
  
      console.log('Friend request sent successfully');
      res.json({ message: 'Friend request sent successfully' });
    } catch (error) {
      console.error('Error in sendFriendRequest:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// controllers/friendController.js

// controllers/friendController.js

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
  
      // Check if the friend request exists in either direction
      let userFriendRequest = user.friends.find(f => f.userId.toString() === friendId);
      let friendFriendRequest = friend.friends.find(f => f.userId.toString() === userId);
  
      if (!userFriendRequest && !friendFriendRequest) {
        console.log('Friend request not found in either direction');
        return res.status(404).json({ message: 'Friend request not found' });
      }
  
      // If the request is found, update it
      if (userFriendRequest) {
        userFriendRequest.isFriend = true;
      } else {
        user.friends.push({ userId: friendId, isFriend: true });
      }
  
      if (friendFriendRequest) {
        friendFriendRequest.isFriend = true;
      } else {
        friend.friends.push({ userId: userId, isFriend: true });
      }
  
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
      console.log('Current user country:', currentUser.country);
      console.log('Current user level:', currentUser.level);
  
      const friendIds = currentUser.friends.map(friend => friend.userId.toString());
      console.log('Friend IDs:', friendIds);
  
      const suggestions = await User.find({
        _id: { $ne: currentUser._id.toString() },
        country: currentUser.country,
        level: currentUser.level,
        _id: { $nin: [currentUser._id.toString(), ...friendIds] }
      }).limit(10).select('username image level country title');
  
      console.log('Suggestions found:', suggestions.length);
      console.log('Suggestion IDs:', suggestions.map(s => s._id));
  
      res.json(suggestions);
    } catch (error) {
      console.error('Error fetching user suggestions:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  