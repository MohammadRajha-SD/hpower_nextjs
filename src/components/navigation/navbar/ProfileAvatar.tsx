import React from "react";

const ProfileAvatar = ({ user }) => {
  return (
    <div className="bg-interactive_color rounded-full p-2 text-white">
      {user?.name}
    </div>
  );
};

export default ProfileAvatar;
