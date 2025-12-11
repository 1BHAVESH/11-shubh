import {
  useCreateFaqMutation,
  useFaqUpdateMutation,
  useGetFaqQuery,
} from "@/redux/features/adminApi";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const AdminFaq = () => {
  const [createFaq] = useCreateFaqMutation();
  const [updateFaq] = useFaqUpdateMutation();
  const { data, isLoading: faqLoading } = useGetFaqQuery();

  const [faqList, setFaqList] = useState([]);

  useEffect(() => {
    if (data?.data) {
      setFaqList(data.data.map((faq) => ({ ...faq })));
    }
  }, [data]);

  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!showModal) {
      setEditingFaq(null);
      reset();
    }
  }, [showModal, reset]);

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setValue("question", faq.question);
    setValue("answer", faq.answer);
    setShowModal(true);
  };

  //  CREATE + UPDATE HANDLER (separate logic)
  const onSubmit = async (formData) => {
    try {
      if (editingFaq) {
        // --- UPDATE API CALL ---
        const res = await updateFaq({
          id: editingFaq._id,
          ...formData,
        }).unwrap();

        // Update UI list
        setFaqList((prev) =>
          prev.map((faq) => (faq._id === editingFaq._id ? res.data : faq))
        );
      } else {
        // --- CREATE API CALL ---
        const res = await createFaq(formData).unwrap();

        setFaqList((prev) => [res.data, ...prev]);
      }

      setShowModal(false);
      reset();
    } catch (error) {
      console.log("FAQ Error:", error);
    }
  };

  const handleDelete = (id) => {
    setFaqList((prev) => prev.filter((faq) => faq._id !== id));
  };

  if (faqLoading) return <h1 className="text-white p-6">Loading...</h1>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add FAQ
          </button>
        </div>

        {/* FAQ LIST */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">All FAQs</h2>

          {faqList.length === 0 ? (
            <p className="text-gray-400">No FAQs found.</p>
          ) : (
            <div className="space-y-4">
              {faqList.map((faq) => (
                <div
                  key={faq._id}
                  className="border-b border-gray-800 pb-4 flex justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{faq.question}</h3>
                    <p className="text-gray-300 text-sm">{faq.answer}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="px-4 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(faq._id)}
                      className="px-4 py-1 bg-red-600 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg relative">
              {/* Close */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-300 hover:text-white text-xl"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold mb-4">
                {editingFaq ? "Edit FAQ" : "Add FAQ"}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* QUESTION */}
                <div>
                  <label className="block mb-2">Question *</label>
                  <input
                    {...register("question", {
                      required: "Question is required",
                    })}
                    className="w-full p-3 bg-gray-800 rounded border border-gray-700"
                    placeholder="Write question..."
                  />
                  {errors.question && (
                    <p className="text-red-400 text-sm">
                      {errors.question.message}
                    </p>
                  )}
                </div>

                {/* ANSWER */}
                <div>
                  <label className="block mb-2">Answer *</label>
                  <textarea
                    {...register("answer", { required: "Answer is required" })}
                    rows={4}
                    className="w-full p-3 bg-gray-800 rounded border border-gray-700"
                    placeholder="Write answer..."
                  />
                  {errors.answer && (
                    <p className="text-red-400 text-sm">
                      {errors.answer.message}
                    </p>
                  )}
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 mt-4">
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
                    {editingFaq ? "Update FAQ" : "Add FAQ"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFaq;
