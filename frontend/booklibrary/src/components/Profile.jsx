import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function Profile({userData}) {
  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
  })


  useEffect(() => {
    setFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: '',
    }); 
  },
  [userData])

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    })); 
  }

  const handleUpdateInfo = async () => {

    try {

      const response = await fetch(`http://localhost:8080/customer/update-profile/${userData._id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': userData.token,
        },
        body: JSON.stringify(formData),
      });

      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        toast.success("User data updated")
        setUpdate(false);
      } else {
        console.error('Request failed:', response.statusText);
        toast.error("failed to update data")
      }
    } catch (error) {
      console.error('Error during API call:', error);
    } 
  };
  return (
    
    <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:pb-24'>
    {(!update && userData) ?
      <>
      <div className="px-4 sm:px-0">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">User Information</h3>
        <p className="mt-1 max-w-2xl text-md leading-6 text-gray-500">Personal details and role.</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-md font-medium leading-6 text-gray-900">First name</dt>
            <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userData.firstName}</dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-md font-medium leading-6 text-gray-900">Last Name</dt>
            <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userData.lastName}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-md font-medium leading-6 text-gray-900">Email</dt>
            <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userData.emailId}</dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-md font-medium leading-6 text-gray-900">Role</dt>
            <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.role}
            </dd>
          </div>
          
        </dl>
        <button
        type="button"
        onClick={() => setUpdate(true)}
        className="rounded-md mt-8 bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Update
      </button>
      </div>
      </>
    : 

    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Update Personal Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Updating your data can reflect on your profile.</p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleOnChange(e)}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleOnChange(e)}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={(e) => handleOnChange(e)}
                    autoComplete="emailId"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button type="button" onClick={() => setUpdate(false)} className="text-sm font-semibold leading-6 text-gray-900">
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleUpdateInfo(e)}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
  
  
  }

    </div>
  )
}
