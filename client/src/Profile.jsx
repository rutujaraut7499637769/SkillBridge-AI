import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile({ onBack, onLogout }) {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("Student");

  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  const API_URL = "https://skillbridge-ai-1-s5wk.onrender.com/skillbridge-ai-1-s5wk.onrender.com/";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const profileUser =
          response.data.user;

        setUser(profileUser);
        setName(profileUser.name);
        setEmail(profileUser.email);
        setAccountType(profileUser.accountType || "Student");
      } catch (error) {
        console.error(
          "Profile fetch error:",
          error
        );
      }
    };

    fetchProfile();
  }, [token]);

  const handleSaveProfile = async () => {
    try {
      setMessage("");

      const response = await axios.put(
        `${API_URL}/profile`,
        {
          name,
          email,
          accountType
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
      setAccountType(response.data.user.accountType || "Student");

      setEditing(false);

      setMessage(
        "Profile updated successfully."
      );

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to update profile."
      );
    }
  };


  const handlePhotoSelect = () => {
    setShowPhotoMenu(false);

    fileInputRef.current?.click();
  };


  const handlePhotoUpload = async (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    try {
      setMessage("");

      const formData = new FormData();

      formData.append(
        "profileImage",
        file
      );

      const response =
        await axios.post(
          `${API_URL}/profile/photo`,
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setUser((previousUser) => ({
        ...previousUser,
        profileImage:
          response.data.profileImage
      }));

      setMessage(
        "Profile photo updated successfully."
      );

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to upload photo."
      );
    }

    event.target.value = "";
  };

  const handleRemovePhoto = async () => {
    try {
      setShowPhotoMenu(false);
      setMessage("");

      await axios.delete(
        `${API_URL}/profile/photo`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setUser((previousUser) => ({
        ...previousUser,
        profileImage: ""
      }));

      setMessage(
        "Profile photo removed."
      );

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to remove photo."
      );
    }
  };

  const profileImage =
    user?.profileImage
      ? `${API_URL}${user.profileImage}`
      : null;

  const userInitial =
    user?.name
      ? user.name
        .charAt(0)
        .toUpperCase()
      : "R";


  if (!user) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }


  return (
    <div className="profile-page">


      <div className="profile-topbar">

        <button
          className="profile-back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="profile-page-title">
          Profile
        </div>

        <div className="profile-top-space"></div>

      </div>


      <div className="profile-cover">

        <div className="profile-header-content">

          <div className="profile-avatar-wrapper">

            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="profile-avatar-image"
              />
            ) : (
              <div className="profile-avatar">
                {userInitial}
              </div>
            )}

            <button
              className="profile-camera-button"
              onClick={() =>
                setShowPhotoMenu(
                  !showPhotoMenu
                )
              }
            >
              📷
            </button>


            {showPhotoMenu && (
              <div className="photo-menu">

                <button
                  onClick={handlePhotoSelect}
                >
                  Change photo
                </button>

                {profileImage && (
                  <button
                    onClick={
                      handleRemovePhoto
                    }
                    className="remove-photo-option"
                  >
                    Remove photo
                  </button>
                )}

              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={
                handlePhotoUpload
              }
              style={{
                display: "none"
              }}
            />

          </div>


          <div className="profile-heading">

            <h1>
              {user.name}
            </h1>

            <p>
              {user.email}
            </p>

            <span className="profile-role">
              SkillBridge {user.accountType || "Student"}
            </span>

          </div>

        </div>

      </div>


      <div className="profile-content">



        {message && (
          <div className="profile-message">
            {message}
          </div>
        )}


        <div className="profile-card">

          <div className="profile-card-header">

            <div>
              <h2>
                Personal Information
              </h2>

              <p>
                Manage your basic account details.
              </p>
            </div>

            {!editing && (
              <button
                className="edit-profile-button"
                onClick={() =>
                  setEditing(true)
                }
              >
                Edit Profile
              </button>
            )}

          </div>


          <div className="profile-form">

            <div className="profile-field">

              <label>
                Full Name
              </label>

              <input
                type="text"
                value={name}
                disabled={!editing}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
              />

            </div>
            <div className="profile-field">
              <label>
                Account Type
              </label>

              <select
                value={accountType}
                disabled={!editing}
                onChange={(event) =>
                  setAccountType(
                    event.target.value
                  )
                }
              >
                <option value="Student">
                  Student
                </option>

                <option value="Instructor">
                  Instructor
                </option>

                <option value="Learner">
                  Learner
                </option>
              </select>
            </div>

            <div className="profile-field">

              <label>
                Email Address
              </label>

              <input
                type="email"
                value={email}
                disabled={!editing}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
              />

            </div>

          </div>


          {editing && (
            <div className="profile-edit-actions">

              <button
                className="cancel-edit-button"
                onClick={() => {
                  setName(user.name);
                  setEmail(user.email);
                  setAccountType(user.accountType || "Student");
                  setEditing(false);
                }}
              >
                Cancel
              </button>

              <button
                className="save-profile-button"
                onClick={
                  handleSaveProfile
                }
              >
                Save Changes
              </button>

            </div>
          )}

        </div>


        <div className="profile-card">

          <div className="profile-card-header">

            <div>
              <h2>
                Account Information
              </h2>

              <p>
                Your SkillBridge account details.
              </p>
            </div>

          </div>


          <div className="account-info-grid">

            <div className="account-info-item">

              <span>
                Account Type
              </span>

              <strong>
                {user.accountType || "Student"}
              </strong>

            </div>


            <div className="account-info-item">

              <span>
                Platform
              </span>

              <strong>
                SkillBridge AI
              </strong>

            </div>


            <div className="account-info-item">

              <span>
                Learning Status
              </span>

              <strong className="active-status">
                Active
              </strong>

            </div>

          </div>

        </div>


        <div className="profile-card security-card">

          <div>

            <h2>
              Account Security
            </h2>

            <p>
              Your account is protected using
              secure authentication.
            </p>

          </div>

          <div className="security-badge">
            Protected
          </div>

        </div>

        <div className="profile-logout-section">

          <button
            className="profile-logout-button"
            onClick={() =>
              setShowLogoutModal(true)
            }
          >
            Logout
          </button>

        </div>

      </div>

      {showLogoutModal && (
        <div className="logout-modal-overlay">

          <div className="logout-modal">

            <div className="logout-icon">
              ↪
            </div>

            <h2>
              Logout from SkillBridge?
            </h2>

            <p>
              Are you sure you want to logout
              from your account?
            </p>

            <div className="logout-modal-actions">

              <button
                className="logout-cancel-button"
                onClick={() =>
                  setShowLogoutModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="logout-confirm-button"
                onClick={onLogout}
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Profile;