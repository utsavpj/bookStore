import { PaperClipIcon } from '@heroicons/react/20/solid'

export default function Profile({userData}) {
  return (
    <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:pb-24'>
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
            <dt className="text-md font-medium leading-6 text-gray-900">Email address</dt>
            <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{userData.emailId}</dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-md font-medium leading-6 text-gray-900">Role</dt>
            <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {userData.role}
            </dd>
          </div>
          
        </dl>
      </div>
    </div>
  )
}
