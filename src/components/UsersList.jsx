const UsersList = ({ users, setSelectedUser }) => {
  return (
    <div className="flex overflow-x-auto gap-2 p-2">
      {users.map((user, i) => (
        <div
          key={i}
          onClick={() => setSelectedUser(user.username)}
          className="cursor-pointer px-3 py-1 bg-gray-500 rounded text-white"
        >
          {user.username}
        </div>
      ))}
    </div>
  );
};

export default UsersList;