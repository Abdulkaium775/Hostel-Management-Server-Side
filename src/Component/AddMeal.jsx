import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../Auth/AuthContext";
import axios from "axios"; // For image upload
import axiosInstance from "../Api/axios"; // For backend API calls
import Swal from "sweetalert2";

const AddMeal = () => {
  const { user } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const IMAGEBB_API_KEY = "4794f23cddfe3b9c5c2c2c6797bc5878";

  // Convert file to base64 string (without prefix)
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the "data:*/*;base64," prefix to get clean base64 string
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadImageToImageBB = async (imageFile) => {
    try {
      const base64Image = await convertToBase64(imageFile);

      const formData = new FormData();
      formData.append("image", base64Image);

      const url = `https://api.imgbb.com/1/upload?key=${IMAGEBB_API_KEY}`;

      const response = await axios.post(url, formData);
      console.log(response.data)  
      if (response.data && response.data.data && response.data.data.url) {
        return response.data.data.url;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);

      // Get image file from input
      const imageFile = data.image[0];
      const imageUrl = await uploadImageToImageBB(imageFile);

      // Prepare meal data payload
      const payload = {
        title: data.title,
        category: data.category,
        image: imageUrl,
        ingredients: data.ingredients,
        description: data.description,
        price: parseFloat(data.price),
        postTime: data.postTime,
        distributorName: user.displayName || "Admin",
        addedByEmail: user.email,
      };

      // Send data to backend
      const response = await axiosInstance.post(
        `${import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:5000"}/meals`,
        payload
      );

      if (response.data.success) {
        Swal.fire("Success!", "Meal added successfully", "success");
        reset();
      } else {
        Swal.fire("Error", "Failed to add meal", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Add New Meal</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.title && <p className="text-red-600">{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full border rounded px-3 py-2"
            defaultValue=""
          >
            <option value="" disabled>Select Category</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
          </select>
          {errors.category && <p className="text-red-600">{errors.category.message}</p>}
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1 font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: "Image is required" })}
            className="w-full"
          />
          {errors.image && <p className="text-red-600">{errors.image.message}</p>}
        </div>

        {/* Ingredients */}
        <div>
          <label className="block mb-1 font-medium">Ingredients</label>
          <textarea
            {...register("ingredients", { required: "Ingredients are required" })}
            rows={3}
            className="w-full border rounded px-3 py-2"
            placeholder="Separate ingredients by commas"
          />
          {errors.ingredients && <p className="text-red-600">{errors.ingredients.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            rows={4}
            className="w-full border rounded px-3 py-2"
          />
          {errors.description && <p className="text-red-600">{errors.description.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price (USD)</label>
          <input
            type="number"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.price && <p className="text-red-600">{errors.price.message}</p>}
        </div>

        {/* Post Time */}
        <div>
          <label className="block mb-1 font-medium">Post Time</label>
          <input
            type="datetime-local"
            {...register("postTime", { required: "Post time is required" })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.postTime && <p className="text-red-600">{errors.postTime.message}</p>}
        </div>

        {/* Distributor Name (readonly) */}
        <div>
          <label className="block mb-1 font-medium">Distributor Name</label>
          <input
            type="text"
            value={user.displayName || ""}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Email (readonly) */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={user.email || ""}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className={`w-full py-2 rounded ${
            isSubmitting || uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {uploading ? "Uploading..." : "Add Meal"}
        </button>
      </form>
    </div>
  );
};

export default AddMeal;
