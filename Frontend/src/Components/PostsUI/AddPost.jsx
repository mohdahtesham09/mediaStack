import React, { useState, useEffect } from "react";
import Select from "react-select";
import LoadingComponent from "../Alert/LoadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesAction } from "../../Redux/slices/categorySlice/categorySlice";
import {
  resetSuccessAction,
  resetErrorAction,
} from "../../Redux/slices/globalSlice/globalSlice";
import ErrorMsg from "../Alert/ErrorMsg";
import SuccessMsg from "../Alert/SuccessMsg";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { addPostAction } from "../../Redux/slices/posts/postSlice";

const AddPost = () => {
  const dispatch = useDispatch();
  // ! Error Massage
  const [errors, setErrors] = useState({});

  const { post, error, loading, success } = useSelector(
    (state) => state?.posts,
  );

  const { categories } = useSelector((state) => state.categories);

  // Track whether user has submitted the form
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Clear stale success/error from previous pages on mount
    dispatch(resetSuccessAction());
    dispatch(resetErrorAction());
    dispatch(fetchCategoriesAction());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: null,
    image: null,
  });
  const validateForm = (data) => {
    let newErrors = {};
    if (!data.title) newErrors.title = "Title is required";
    if (!data.image) newErrors.image = "Image is required";
    if (!data.content) newErrors.content = "Content is required";
    if (!data.category) newErrors.category = "Category is required";
    return newErrors;
  };

  // Handle Blur for validation
  const handleBlur = (e) => {
    const { name } = e.target;
    const formErrors = validateForm(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: formErrors[name],
    }));
  };

  // Fix: Handle nested categories data structure based on Redux DevTools
  const allCategories = categories?.allCategories || [];

  const options = Array.isArray(allCategories)
    ? allCategories.map((category) => {
      return { value: category?._id, label: category?.name };
    })
    : [];
  const [preview, setPreview] = useState(null);

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Handle File Change & Preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert("File size too large (max 5MB)");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  // Remove Image
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreview(null);
  };

  // Handle Select Change
  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      category: selectedOption?.value || null,
    }));
    setErrors((prev) => ({ ...prev, category: null }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const formErrors = validateForm(formData);
    setErrors(formErrors);

    // If there are errors, stop
    if (Object.keys(formErrors).length > 0) return;

    setIsSubmitted(true);
    try {
      await dispatch(addPostAction(formData)).unwrap();
      // Only reset form after successful API response
      setFormData({ title: "", content: "", category: null, image: null });
      setPreview(null);
      setErrors({});
    } catch {
      // Error is already captured in Redux state by rejectWithValue
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
      <div className='max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100'>
        {/* Header */}
        <div className='text-center'>
          <h2 className='mt-2 text-3xl font-extrabold text-slate-900 tracking-tight'>
            Create New Post
          </h2>
          <p className='mt-2 text-sm text-slate-500'>
            Share your thoughts with the world.
          </p>
        </div>

        {/* Messages — only show after user submits */}
        {isSubmitted && error && <ErrorMsg message={error?.message || error} />}
        {isSubmitted && success && (
          <SuccessMsg message='Post created successfully!' />
        )}

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='title' className='sr-only'>
                Title
              </label>
              <input
                id='title'
                name='title'
                type='text'
                required
                className='appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200'
                placeholder='Post Title'
                value={formData.title}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={loading}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1 ml-2">{errors.title}</p>}
            </div>
          </div>

          {/* Image Upload */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-slate-700'>
              Cover Image
            </label>

            {!preview ? (
              <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-blue-400 transition-colors cursor-pointer group relative'>
                <input
                  id='file-upload'
                  name='image'
                  type='file'
                  className='sr-only'
                  onChange={handleFileChange}
                  accept='image/*'
                  disabled={loading}
                />
                <label
                  htmlFor='file-upload'
                  className='space-y-1 text-center cursor-pointer w-full h-full'
                >
                  <PhotoIcon className='mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-500 transition-colors' />
                  <div className='flex text-sm text-slate-600 justify-center'>
                    <span className='relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500'>
                      Upload a file
                    </span>
                    <p className='pl-1'>or drag and drop</p>
                  </div>
                  <p className='text-xs text-slate-500'>
                    PNG, JPG, GIF up to 5MB
                  </p>
                </label>
              </div>
            ) : (
              <div className='relative mt-1 rounded-xl overflow-hidden group border border-slate-200 shadow-sm'>
                <img
                  src={preview}
                  alt='Preview'
                  className='h-64 w-full object-cover transform group-hover:scale-105 transition-transform duration-500'
                />
                <button
                  type='button'
                  onClick={removeImage}
                  className='absolute top-2 right-2 bg-white/80 p-1.5 rounded-full shadow-md hover:bg-white text-slate-600 hover:text-red-500 transition-all backdrop-blur-sm'
                >
                  <XMarkIcon className='w-5 h-5' />
                </button>
              </div>
            )}
            {errors.image && <p className="text-red-500 text-sm mt-1 ml-2">{errors.image}</p>}
          </div>

          {/* Category Select */}
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>
              Category
            </label>
            <Select
              options={options}
              name='category'
              onChange={handleSelectChange}
              className='basic-single'
              classNamePrefix='select'
            />
            {errors.category && <p className="text-red-500 text-sm mt-1 ml-2">{errors.category}</p>}
          </div>

          {/* Content Textarea */}
          <div>
            <label htmlFor='content' className='sr-only'>
              Content
            </label>
            <textarea
              id='content'
              name='content'
              rows='8'
              required
              className='appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200 resize-none'
              placeholder="What's on your mind?"
              value={formData.content}
              onChange={handleInputChange}
              onBlur={handleBlur}
              disabled={loading}
            ></textarea>
            <div className='text-right text-xs text-slate-400 mt-1'>
              {formData.content?.length || 0} characters
            </div>
            {errors.content && <p className="text-red-500 text-sm mt-1 ml-2">{errors.content}</p>}
          </div>

          {/* Submit Button */}
          <div>
            {loading ? (
              <LoadingComponent />
            ) : (
              <button
                type='submit'
                className='group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-xl bg-[#A6D6E6] hover:bg-[#8FC7DB] text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              >
                Create Post
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
