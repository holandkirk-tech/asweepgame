import { useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";

export default function BottomRightIcons() {
  const [facebookOpen, setFacebookOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const closeModals = () => {
    setFacebookOpen(false);
    setInfoOpen(false);
  };

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-4 z-50">
        <button
          onClick={() => setFacebookOpen(true)}
          className="p-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
          aria-label="Open Facebook link"
        >
          <FaFacebookF size={35} />
        </button>

        <button
          onClick={() => setInfoOpen(true)}
          className="p-2 rounded-full bg-white text-black shadow-lg hover:bg-gray-800 hover:text-white transition"
          aria-label="Open information"
        >
          <IoIosInformationCircleOutline size={35} />
        </button>
      </div>

      {/* Facebook Modal */}
      {facebookOpen && (
        <div
          onClick={closeModals}
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-40"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-sm w-full p-6 relative"
          >
            <button
              onClick={closeModals}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Close modal"
            >
              &#x2715;
            </button>
            <h2 className="text-xl font-semibold mb-4">Facebook Link</h2>
            <p>
              Visit our Facebook page:{" "}
              <a
                href="https://facebook.com/yourpage"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                facebook.com/yourpage
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {infoOpen && (
        <div
          onClick={closeModals}
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-40"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-black text-white rounded-lg max-w-lg w-full p-6 relative"
          >
            <button
              onClick={closeModals}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              aria-label="Close modal"
            >
              &#x2715;
            </button>

            <div className="inter-font text-sm text-white leading-relaxed">
              <p>
                <strong>
                  Account Creation and Eligibility for Free Spin Wheel
                </strong>
              </p>
              <p>
                To participate in the Free Spin Wheel, new players must message
                our official Facebook page to create an account.
              </p>

              <p>
                <strong>Free Spin Wheel Access</strong>
              </p>
              <p>
                New players will have access to the Free Spin Wheel for a
                24-hour period from the time of account creation.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
