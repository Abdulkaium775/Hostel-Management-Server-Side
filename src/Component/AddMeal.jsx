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
      if (response.data?.data?.url) {
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

      const imageFile = data.image[0];
      const imageUrl = await uploadImageToImageBB(imageFile);

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
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Add New Meal</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: "Title is required" })}
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter meal title"
          />
          {errors.title && <p className="mt-1 text-red-600 text-sm">{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block mb-2 font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            {...register("category", { required: "Category is required" })}
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
            defaultValue=""
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
          </select>
          {errors.category && <p className="mt-1 text-red-600 text-sm">{errors.category.message}</p>}
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image" className="block mb-2 font-medium text-gray-700">
            Image <span className="text-red-500">*</span>
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            {...register("image", { required: "Image is required" })}
            className={`w-full text-gray-700 ${
              errors.image ? "border-red-500" : ""
            }`}
          />
          {errors.image && <p className="mt-1 text-red-600 text-sm">{errors.image.message}</p>}
        </div>

        {/* Ingredients */}
        <div>
          <label htmlFor="ingredients" className="block mb-2 font-medium text-gray-700">
            Ingredients <span className="text-red-500">*</span>
          </label>
          <textarea
            id="ingredients"
            {...register("ingredients", { required: "Ingredients are required" })}
            rows={3}
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.ingredients ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Separate ingredients by commas"
          />
          {errors.ingredients && <p className="mt-1 text-red-600 text-sm">{errors.ingredients.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            {...register("description", { required: "Description is required" })}
            rows={4}
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describe the meal"
          />
          {errors.description && <p className="mt-1 text-red-600 text-sm">{errors.description.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block mb-2 font-medium text-gray-700">
            Price (USD) <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter price in USD"
          />
          {errors.price && <p className="mt-1 text-red-600 text-sm">{errors.price.message}</p>}
        </div>

        {/* Post Time */}
        <div>
          <label htmlFor="postTime" className="block mb-2 font-medium text-gray-700">
            Post Time <span className="text-red-500">*</span>
          </label>
          <input
            id="postTime"
            type="datetime-local"
            {...register("postTime", { required: "Post time is required" })}
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.postTime ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.postTime && <p className="mt-1 text-red-600 text-sm">{errors.postTime.message}</p>}
        </div>

        {/* Distributor Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Distributor Name</label>
          <input
            type="text"
            value={user.displayName || ""}
            readOnly
            className="w-full border rounded-md px-4 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user.email || ""}
            readOnly
            className="w-full border rounded-md px-4 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className={`w-full py-3 rounded-md text-white font-semibold transition-colors duration-200 ${
            isSubmitting || uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Add Meal"}
        </button>
      </form>
    </div>
  );
};

export default AddMeal;
