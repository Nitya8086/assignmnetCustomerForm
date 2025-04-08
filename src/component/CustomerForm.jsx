import React, { useState, useRef, useEffect } from 'react';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const CustomerForm = () => {
  const initialFormState = {
    name: '',
    mobile: '',
    orderDate: '',
    gender: '',
    bloodGroup: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [submittedData, setSubmittedData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const dropdownRef = useRef(null);

  const formatOrderDate = (value) => {
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentYear = today.getFullYear();

    let newValue = value;
    if (/^\d{2}\/$/.test(value)) {
      newValue += `${currentMonth}/${currentYear}`;
    } else if (/^\d{2}\/\d{2}$/.test(value)) {
      newValue += `/${currentYear}`;
    }
    return newValue;
  };

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
    setSearchText('');
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();


    const isEmpty = Object.values(formData).some((val) => val.trim() === '');
    if (isEmpty) {
      alert('Please fill in all fields');
      return;
    }

    console.log('Submitted Form:', formData);
    setSubmittedData(formData);
    setFormData(initialFormState); 
  };

  const filteredBloodGroups = bloodGroups.filter((bg) =>
    bg.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Customer Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium mb-1">Customer Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Mobile Number</label>
          <input
            type="text"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Order Date</label>
          <input
            type="text"
            value={formData.orderDate}
            onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                const updatedDate = formatOrderDate(formData.orderDate);
                setFormData((prev) => ({ ...prev, orderDate: updatedDate }));
              }
            }}
            onBlur={() => {
              const updatedDate = formatOrderDate(formData.orderDate);
              setFormData((prev) => ({ ...prev, orderDate: updatedDate }));
            }}
            placeholder="DD/ or DD/MM"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Blood Group</label>
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={handleDropdownClick}
              className="border p-2 rounded cursor-pointer bg-white"
            >
              {formData.bloodGroup || 'Select Blood Group'}
            </div>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border mt-1 z-10 max-h-48 overflow-y-auto rounded shadow">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full p-2 border-b"
                />
                {filteredBloodGroups.map((group) => (
                  <div
                    key={group}
                    onClick={() => {
                      setFormData({ ...formData, bloodGroup: group });
                      setShowDropdown(false);
                    }}
                    className={`p-2 cursor-pointer hover:bg-gray-100 ${
                      group === formData.bloodGroup ? 'bg-gray-100' : ''
                    }`}
                  >
                    {group}
                  </div>
                ))}
                {filteredBloodGroups.length === 0 && (
                  <div className="p-2 text-gray-400">No results</div>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>

      {submittedData && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-green-700">Submitted Data</h3>
          <p><strong>Name:</strong> {submittedData.name}</p>
          <p><strong>Mobile:</strong> {submittedData.mobile}</p>
          <p><strong>Order Date:</strong> {submittedData.orderDate}</p>
          <p><strong>Gender:</strong> {submittedData.gender}</p>
          <p><strong>Blood Group:</strong> {submittedData.bloodGroup}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerForm;
