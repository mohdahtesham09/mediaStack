import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchPostDetailsAction,
  resetPostMutationState,
  updatePostAction,
} from "../../Redux/slices/posts/postSlice";
import SuccessMsg from "../Alert/SuccessMsg";
import ErrorMsg from "../Alert/ErrorMsg";
import LoadingComponent from "../Alert/LoadingComponent";

const EditPost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, loading, error, updateLoading, postUpdated } = useSelector(
    (state) => state.posts
  );
  const authUser = useSelector((state) => state?.users?.userAuth?.userInfo);

  const postData = useMemo(() => post?.post || null, [post]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    dispatch(fetchPostDetailsAction(id));
    dispatch(resetPostMutationState());
  }, [dispatch, id]);

  useEffect(() => {
    if (postUpdated) {
      const timer = setTimeout(() => navigate("/user-profile"), 800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [navigate, postUpdated]);

  const isOwner =
    postData?.author &&
    authUser?._id &&
    String(postData.author?._id || postData.author) === String(authUser._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(
      updatePostAction({
        postId: id,
        payload: {
          title: isDirty ? title : postData?.title || "",
          content: isDirty ? content : postData?.content || "",
        },
      })
    );
  };

  if (loading && !postData) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <LoadingComponent />
      </div>
    );
  }

  if (postData && !isOwner) {
    return (
      <div className='min-h-screen flex items-center justify-center p-6'>
        <p className='text-red-500 font-medium'>
          You are not authorized to edit this post.
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50 py-10 px-4'>
      <div className='max-w-3xl mx-auto bg-white border border-slate-100 rounded-xl p-8 shadow-sm'>
        <h1 className='text-2xl font-bold text-slate-900 mb-6'>Edit Post</h1>

        {error && <ErrorMsg message={error?.message || "Failed to update post"} />}
        {postUpdated && <SuccessMsg message='Post updated successfully' />}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>
              Title
            </label>
            <input
              name='title'
              type='text'
              value={isDirty ? title : postData?.title || ""}
              onChange={(e) => {
                if (!isDirty) {
                  setTitle(postData?.title || "");
                  setContent(postData?.content || "");
                }
                setIsDirty(true);
                setTitle(e.target.value);
              }}
              className='w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
              disabled={updateLoading}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>
              Content
            </label>
            <textarea
              name='content'
              rows='10'
              value={isDirty ? content : postData?.content || ""}
              onChange={(e) => {
                if (!isDirty) {
                  setTitle(postData?.title || "");
                  setContent(postData?.content || "");
                }
                setIsDirty(true);
                setContent(e.target.value);
              }}
              className='w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
              disabled={updateLoading}
            />
          </div>

          <div className='flex items-center gap-3'>
            <button
              type='submit'
              disabled={updateLoading}
              className='bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-slate-400'
            >
              {updateLoading ? "Updating..." : "Update Post"}
            </button>
            <button
              type='button'
              onClick={() => navigate("/user-profile")}
              className='border border-slate-300 text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-50'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
