import { FaEnvelope, FaMapMarkedAlt, FaPhone } from "react-icons/fa";

const Contact = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen py-12 bg-cover bg-center"
      style={{ backgroundImage: "url('')" }}
      data-testid="contact-container">

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg" data-testid="contact-form-container">
        <h1 className="text-4xl font-bold text-center mb-6" data-testid="contact-heading">Contact us</h1>
        <p className="text-gray-600 text-center mb-4">
          We would love to hear from you! Please fill out the form below or contact us directly
        </p>

        <form className="space-y-4" data-testid="contact-form">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus: ring-blue-500"
              data-testid="name-input" />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus: ring-blue-500"
              data-testid="email-input" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              rows="4"
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus: ring-blue-500"
              data-testid="message-input" />
          </div>

          <button
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            data-testid="send-button">
            Send Message
          </button>
        </form>

        <div className="mt-8 text-center" data-testid="contact-info">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          <div className="flex flex-col items-center space-y-2 mt-4">
            <div className="flex items-center" data-testid="phone-info">
              <FaPhone className="text-blue-500 mr-2" />
              <span className="text-gray-600">+353 87 123 4567</span>
            </div>

            <div className="flex items-center" data-testid="email-info">
              <FaEnvelope className="text-blue-500 mr-2" />
              <span className="text-gray-600">genwei74022@gmail.com</span>
            </div>

            <div className="flex items-center" data-testid="address-info">
              <FaMapMarkedAlt className="text-blue-500 mr-2" />
              <span className="text-gray-600">123 Street, Dublin, Ireland</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Contact;