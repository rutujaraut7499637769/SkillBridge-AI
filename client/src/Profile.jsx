import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile({ onBack, onLogout }) {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const profileUser = response.data.user;

      setUser(profileUser);
      setName(profileUser.name);
      setEmail(profileUser.email);

    } catch (error) {
      console.log("Profile error:", error);

      if (error.response?.status === 401) {
        onLogout();
      }

    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Name and email are required");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/profile",
        {
          name: name.trim(),
          email: email.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(response.data.user);
      setName(response.data.user.name);
      setEmail(response.data.user.email);

      setEditing(false);

      alert("Profile updated successfully");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to update profile"
      );

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-header">

        <button
          className="profile-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>
          <h1>My Profile</h1>
          <p>
            Manage your SkillBridge AI account.
          </p>
        </div>

      </div>


      <div className="profile-card">

        <div className="profile-avatar">
          {user?.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}
        </div>

        <div className="profile-main-info">

          <h2>
            {user?.name || "User"}
          </h2>

          <p>
            {user?.email || ""}
          </p>

        </div>

      </div>


      <div className="profile-details-card">

        <div className="profile-details-header">

          <div>
            <h2>Personal Information</h2>

            <p>
              Update your account information.
            </p>
          </div>

          {!editing && (
            <button
              className="edit-profile-button"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}

        </div>


        <div className="profile-form">

          <div className="profile-field">

            <label>Full Name</label>

            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your full name"
              />
            ) : (
              <div className="profile-value">
                {user?.name}
              </div>
            )}

          </div>


          <div className="profile-field">

            <label>Email</label>

            {editing ? (
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
              />
            ) : (
              <div className="profile-value">
                {user?.email}
              </div>
            )}

          </div>


          {editing && (
            <div className="profile-actions">

              <button
                className="cancel-profile-button"
                onClick={() => {
                  setName(user.name);
                  setEmail(user.email);
                  setEditing(false);
                }}
              >
                Cancel
              </button>

              <button
                className="save-profile-button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>
          )}

        </div>

      </div>


      <div className="profile-account-card">

        <div>
          <h2>Account</h2>

          <p>
            Your SkillBridge AI account is protected
            with secure authentication.
          </p>
        </div>

        <button
          className="profile-logout-button"
          onClick={onLogout}
        >
          🚪 Logout
        </button>

      </div>

    </div>
  );
}

export default Profile;