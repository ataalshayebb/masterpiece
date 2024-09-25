import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCloud, faCreditCard, faLock } from '@fortawesome/free-solid-svg-icons';

export const LongerMessagesPopup = ({ onSubscribe, onClose }) => (
  <div className="bg-gray-800 text-white p-4 rounded-lg max-w-md relative">
    <FontAwesomeIcon icon={faTimes} className="text-gray-400 cursor-pointer absolute top-2 right-2" onClick={onClose} />
    <h2 className="text-2xl font-bold mb-4">Wanna call friends ?</h2>
    <p className="mb-4">Call friends for an unlimited time with our ultra smooth calling system!</p>
    <button className="bg-pink-500 px-4 py-2 rounded w-full" onClick={onSubscribe}>Subscribe</button>
  </div>
);

export const NitroPlanPopup = ({ onSelect, onClose }) => (
  <div className="bg-gray-800 text-white p-4 rounded-lg max-w-md relative">
    <FontAwesomeIcon icon={faTimes} className="text-gray-400 cursor-pointer absolute top-2 right-2" onClick={onClose} />
    <h2 className="text-2xl font-bold mb-4">NITRO</h2>
    <div className="mb-4">
      <h3 className="text-lg mb-2">Choose one:</h3>
      <div className="flex items-center mb-2">
        <input type="radio" id="yearly" name="plan" className="mr-2" defaultChecked />
        <label htmlFor="yearly">Yearly <span className="bg-green-500 text-xs px-2 py-1 rounded">SAVE 16%</span></label>
        <span className="ml-auto">$99.99</span>
      </div>
      <div className="flex items-center">
        <input type="radio" id="monthly" name="plan" className="mr-2" />
        <label htmlFor="monthly">Monthly</label>
        <span className="ml-auto">$9.99</span>
      </div>
    </div>
    <div className="mb-4">
      <p>Total: $99.99 / Year</p>
      <p className="text-xs text-gray-400">Final price and currency will be based on your selected payment method. Learn More.</p>
    </div>
    <button className="bg-pink-500 w-full py-2 rounded" onClick={onSelect}>Select</button>
  </div>
);

export const PaymentTypePopup = ({ onClose }) => (
  <div className="bg-gray-800 text-white p-4 rounded-lg max-w-md relative">
    <FontAwesomeIcon icon={faTimes} className="text-gray-400 cursor-pointer absolute top-2 right-2" onClick={onClose} />
    <h2 className="text-2xl font-bold mb-4">NITRO</h2>
    <h3 className="text-lg mb-4">SELECT PAYMENT TYPE :</h3>
    <div className="flex justify-between mb-4">
      <button className="bg-pink-500 px-4 py-2 rounded flex items-center">
        <FontAwesomeIcon icon={faCloud} className="mr-2" />
        PayPal
      </button>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-gray-400 text-sm flex items-center">
        <FontAwesomeIcon icon={faLock} className="mr-1" />
        Secure
      </span>
    </div>
  </div>
);

const App = () => {
  const [currentPopup, setCurrentPopup] = useState('longerMessages');

  const handleSubscribe = () => setCurrentPopup('nitroPlan');
  const handleSelect = () => setCurrentPopup('paymentType');
  const handleClose = () => setCurrentPopup(null);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      {currentPopup === 'longerMessages' && <LongerMessagesPopup onSubscribe={handleSubscribe} onClose={handleClose} />}
      {currentPopup === 'nitroPlan' && <NitroPlanPopup onSelect={handleSelect} onClose={handleClose} />}
      {currentPopup === 'paymentType' && <PaymentTypePopup onClose={handleClose} />}
    </div>
  );
};

export default App;
