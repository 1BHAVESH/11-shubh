import {
  useCreateJobMutation,
  useGetJobQuery,
  useUpdateJobMutation,
} from "@/redux/features/adminApi";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const CareerAdmin = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

 
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  // GET Job API
  const { data: jobData, isLoading: isLoadingJobs, error } = useGetJobQuery();

  // Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Reset when modal closes
  useEffect(() => {
    if (!showModal) {
      setEditingJob(null);
      reset();
    }
  }, [showModal, reset]);

  // Populate when editing
  useEffect(() => {
    if (editingJob) {
      setValue("jobTitle", editingJob.jobTitle);
      setValue("places", editingJob.places);
      setValue("positions", editingJob.positions);
    }
  }, [editingJob, setValue]);

  // SUBMIT HANDLER
const onSubmit = async (formData) => {
  try {
    if (editingJob) {
      // Update API
      const response = await updateJob({
        id: editingJob._id,
        ...formData,
      }).unwrap();

      console.log("Updated:", response);
    } else {
      // Create API
      await createJob(formData).unwrap();
    }

    setShowModal(false);
    reset();
  } catch (error) {
    console.error("Error saving job:", error);
  }
};


  // DELETE CLICK HANDLER
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  // CONFIRM DELETE (STATIC)
  const confirmDelete = () => {
    if (!deleteId) return;

    jobData.data = jobData.data.filter((job) => job._id !== deleteId);

    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  // EDIT CLICK HANDLER
  const handleEdit = (job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  // LOADING UI
  if (isLoadingJobs) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading careers...</p>
        </div>
      </div>
    );
  }

  // ERROR UI
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading careers</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const jobs = jobData?.data || [];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Career Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            + Add New Position
          </button>
        </div>
      </div>

      {/* JOB LIST */}
      <div className="max-w-6xl mx-auto">
        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-lg">
            <p className="text-gray-400 text-lg">No career positions added yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Add First Position
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-gray-900 p-6 rounded-lg flex justify-between items-center hover:bg-gray-800 transition"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{job.jobTitle}</h3>
                  <div className="flex gap-6 text-gray-400">
                    <span>{job.places}</span>
                    <span>{job.positions} Positions</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(job)}
                    className="px-5 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(job._id)}
                    className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
     {showModal && (
  <div className="fixed inset-0 flex justify-center items-center p-4 bg-black bg-opacity-70">
    <div className="bg-gray-900 p-8 rounded-lg w-full max-w-lg relative">

      {/*  CROSS BUTTON */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-300 border-2 cursor-pointer border-amber-300 hover:text-white transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-2xl font-bold mb-6">
        {editingJob ? "Edit Position" : "Add New Position"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* JOB TITLE */}
        <div>
          <label className="block mb-2 font-medium">Job Title *</label>
          <input
            {...register("jobTitle", { required: "Job title is required" })}
            className="w-full p-3 bg-gray-800 rounded border border-gray-700"
            placeholder="e.g., Frontend Developer"
          />
          {errors.jobTitle && (
            <p className="text-red-400 text-sm">{errors.jobTitle.message}</p>
          )}
        </div>

        {/* LOCATION */}
        <div>
          <label className="block mb-2 font-medium">Location *</label>
          <input
            {...register("places", { required: "Location is required" })}
            className="w-full p-3 bg-gray-800 rounded border border-gray-700"
            placeholder="e.g., Udaipur"
          />
          {errors.places && (
            <p className="text-red-400 text-sm">{errors.places.message}</p>
          )}
        </div>

        {/* POSITIONS */}
        <div>
          <label className="block mb-2 font-medium">Number of Positions *</label>
          <input
            type="number"
            {...register("positions", {
              required: "Positions required",
              min: { value: 1, message: "Must be at least 1" },
            })}
            className="w-full p-3 bg-gray-800 rounded border border-gray-700"
          />
          {errors.positions && (
            <p className="text-red-400 text-sm">{errors.positions.message}</p>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShowModal(false)}
            type="button"
            className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            {editingJob ? "Update Position" : "Add Position"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0   flex justify-center items-center  p-4">
          <div className="bg-gray-900 p-8 rounded-lg text-center max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Delete Position?</h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this position? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerAdmin;
