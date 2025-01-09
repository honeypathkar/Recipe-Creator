import React from "react";

export default function HomeScreen({ user }) {
  return (
    <div className="flex justify-center items-center">
      <div className="text-2xl">Welcome back, {user.name}</div>
    </div>
  );
}
