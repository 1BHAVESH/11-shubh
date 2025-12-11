import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useMailSendMutation } from "@/redux/features/shubamdevApi";

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [mailSend, { isLoading }] = useMailSendMutation();


  const onSubmit = async (data) => {
    // toast.promise for loading + success + error

    const finalData = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      message: data.message,
      
    };
    

    console.log(finalData)
    await toast.promise(mailSend(finalData).unwrap(), {
      loading: "Sending your message...",
      success: "Mail sent successfully!",
      error: "Failed to send email",
    });

    reset(); // reset form after sending
  };

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      {/* Section Title */}
      <p className="text-[#d4af37] text-[20px] font-bold uppercase mb-2 tracking-wide">
        — <span className="text-black">Contact</span>
      </p>
      <h2 className="text-[24px] md:text-[24px] font-normal mb-10">Let’s Talk</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* LEFT FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* FIRST & LAST NAME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">First Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Last Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter a valid 10-digit phone number",
                },
              })}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block text-sm mb-1">Message</label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              {...register("message", { required: "Message is required" })}
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-[#d4af37] text-white py-2 rounded-md font-semibold hover:bg-[#b98d2c] transition"
          >
            Submit
          </button>
        </form>

        {/* RIGHT MAP */}
        <div>
        <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3568.894429436179!2d73.000374!3d26.279652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDE2JzQ2LjgiTiA3M8KwMDAnMDIuMSJF!5e0!3m2!1sen!2sin!4v1733039844000!5m2!1sen!2sin"
  className="w-full h-[480px] rounded-xl shadow-md border"
  loading="lazy"
  allowFullScreen=""
  referrerPolicy="no-referrer-when-downgrade"
></iframe>

        </div>
      </div>
    </section>
  );
}
