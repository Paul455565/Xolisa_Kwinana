import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import UserDashboardLayout from "./UserDashboardLayout";

const UserMusic = () => {
  const [username, setUsername] = useState("User");
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUsername(data.name || user.displayName || "User");
        } else {
          setUsername(user.displayName || "User");
        }
      }
    };
    fetchUserName();
  }, [user]);

  return (
    <UserDashboardLayout username={username} onLogout={() => auth.signOut().then(() => window.location.href = "/")}>
      <div style={{ padding: "20px" }}>
        <h1>Music</h1>
        <p>No music released yet.</p>
      </div>
    </UserDashboardLayout>
  );
};

export default UserMusic;
