let users = {};

//Add user
function addUser(id, username, room) {
  users[id] = { id, username, room };
}

//Remove user
function removeUser(id) {
  delete users[id];
}

//Get single user
function getUser(id) {
  return users[id];
}

//Get all users in a room
function getUsersInRoom(room) {
  return Object.values(users).filter((user) => user.room === room);
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};