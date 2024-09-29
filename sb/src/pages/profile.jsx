import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navBar";

function Profile() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phonenumber: "",
    bio: "",
    level: "",
    city: "",
    image: "https://via.placeholder.com/150"
  });
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.backgroundColor = '#ffffff';
    fetchUserData();
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/profile/user", {
        headers: { "x-auth-token": token }
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: name === "bio" ? value.slice(0, 40) : value
    }));
  };

  const handleImageUrlChange = (e) => {
    setNewImageUrl(e.target.value);
  };

  const updateImageUrl = () => {
    if (newImageUrl) {
      setUserData(prevData => ({
        ...prevData,
        image: newImageUrl
      }));
    }
    setIsEditingImage(false);
    setNewImageUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("http://localhost:5000/api/profile/user", userData, {
        headers: { "x-auth-token": token }
      });
      setUserData(response.data);
      
      Swal.fire({
        title: 'Success!',
        text: 'Profile updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

    } catch (error) {
      console.error("Error updating profile:", error);
 
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update profile. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white text-gray-900 shadow-md rounded-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4 w-32 h-32 bg-center bg-cover rounded-full overflow-hidden">
            <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="mb-4 flex items-center">
            {!isEditingImage ? (
              <button onClick={() => setIsEditingImage(true)} className="bg-pink-500 text-white p-2 rounded-md shadow-md hover:bg-pink-600">
                Edit Image URL
              </button>
            ) : (
              <>
                <input 
                  type="text" 
                  value={newImageUrl} 
                  onChange={handleImageUrlChange} 
                  placeholder="Enter new image URL"
                  className="p-2 border border-gray-300 rounded-md mr-2"
                />
                <button onClick={updateImageUrl} className="bg-green-500 text-white p-2 rounded-md shadow-md hover:bg-green-600">
                  Confirm
                </button>
              </>
            )}
          </div>
          <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>
          <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-900">Name</label>
              <input type="text" name="username" value={userData.username || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 bg-gray-100 text-gray-900 rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-900">Email</label>
              <input type="email" name="email" value={userData.email || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 bg-gray-100 text-gray-900 rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-900">Number</label>
              <input type="text" name="phonenumber" value={userData.phonenumber || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 bg-gray-100 text-gray-900 rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-900">City</label>
              <input type="text" name="city" value={userData.city || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 bg-gray-100 text-gray-900 rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-900">Bio (40 characters max)</label>
              <textarea name="bio" value={userData.bio || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 bg-gray-100 text-gray-900 rounded-md" maxLength="40" />
              <div className="text-right text-sm text-gray-600">{(userData.bio || '').length}/40</div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-900">Education</label>
              <select name="level" value={userData.level || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 bg-gray-100 text-gray-900 rounded-md">
                <option value="">Select your education level</option>
                <option value="tawjihi">Tawjihi</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                
              </select>
            </div>
            <div className="flex justify-between mt-6">
              <button type="submit" className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-md hover:bg-pink-600">
                Save
              </button>
              <button type="button" onClick={fetchUserData} className="px-4 py-2 bg-gray-600 text-gray-200 font-semibold rounded-md hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Profile;