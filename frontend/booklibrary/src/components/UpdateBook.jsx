import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify';


export default function UpdateBook({onClose, bookData, userData}) {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState(bookData);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      bookImage: file,
    }));
  };
  const handleBookUpdate = async () => {
    try {

      
  
      // Make API call to store book data
      const response = await fetch(`http://localhost:8080/books/updateBook/${bookData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": userData.token,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        toast.success("Book updated sucessfully")
      } else {
        console.log(response)
        toast.error("Failed to update book: ", response);
      }
    } catch (error) {
      console.error("Error during book addition:", error);
    }
    onClose(); // Close the dialog after submission
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            Update Book
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={onClose}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-indigo-300">
                            Get started by filling in the information below to update your book project.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          <div className="space-y-6 pb-5 pt-6">
                          <div className="sm:col-span-4">
                          <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                            Book Name
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                              <input
                                type="text"
                                name="bookName"
                                id="bookName"
                                value={formData.bookName}
                                onChange={(e) => handleInputChange(e)}
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="harry potter"
                              />
                            </div>
                          </div>
                        </div>
          
                        <div className="sm:col-span-4">
                        <label htmlFor="bookAuthor" className="block text-sm font-medium leading-6 text-gray-900">
                          Book Author
                        </label>
                        <div className="mt-2">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                              type="text"
                              name="bookAuthor"
                              id="bookAuthor"
                              value={formData.bookAuthor}
                              onChange={(e) => handleInputChange(e)}
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                              placeholder="J. K. Rowling"
                            />
                          </div>
                        </div>
                      </div>
          
                      <div className="sm:col-span-4">
                        <label htmlFor="bookPrice" className="block text-sm font-medium leading-6 text-gray-900">
                          Book Price (in USD)
                        </label>
                        <div className="mt-2">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input
                              type="text"
                              name="bookPrice"
                              id="bookPrice"
                              value={formData.bookPrice}
                              onChange={(e) => handleInputChange(e)}
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                              placeholder="45"
                            />
                          </div>
                        </div>
                      </div>
          
                      <div className="sm:col-span-4">
                      <label htmlFor="bookCategory" className="block text-sm font-medium leading-6 text-gray-900">
                        Book Category/ Genre
                      </label>
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                          <input
                            type="text"
                            name="bookCategory"
                            id="bookCategory"
                            value={formData.bookCategory}
                            onChange={(e) => handleInputChange(e)}
                            className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Fantasy"
                          />
                        </div>
                      </div>
                    </div>
          
          
                        <div className="col-span-full">
                          <label htmlFor="bookDescription" className="block text-sm font-medium leading-6 text-gray-900">
                            Description
                          </label>
                          <div className="mt-2">
                            <textarea
                              id="bookDescription"
                              name="bookDescription"
                              value={formData.bookDescription}
                              onChange={(e) => handleInputChange(e)}
                              rows={3}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              defaultValue={''}
                            />
                          </div>
                          <p className="mt-3 text-sm leading-6 text-gray-600">Write a few words about what this book is about.</p>
                        </div>
          
                        <div className="col-span-full">
                          <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                            Book Cover Photo
                          </label>
                          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                              <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label
                                  htmlFor="bookImage"
                                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                  <span>Upload a Image</span>
                                  <input id="bookImage" name="bookImage" type="file" onChange={(e) => handleFileInputChange(e)}  accept="image/*"   className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          </div>
                        </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleBookUpdate}
                        className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
