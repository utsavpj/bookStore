import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { toast } from 'react-toastify';

export default function AddBook({userData}) {
  const [newBookData, setNewBookData] = useState({});
  console.log("USerData:" , userData)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setNewBookData((prevData) => ({
      ...prevData,
      bookImage: file,
    }));
  };


  const handleAddBook = async () => {
    try {
      console.log("Book Data", newBookData)
      
  
      // Make API call to store book data
      const response = await fetch("http://localhost:8080/books/CreateBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": userData.token,
        },
        body: JSON.stringify(newBookData),
      });
  
      if (response.ok) {
        toast.success("Book added sucessfully")
      } else {
        console.log(response)
        toast.error("Failed to add book: ", response);
      }
    } catch (error) {
      console.error("Error during book addition:", error);
    }

  }
  return (
    <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:pb-24'>
    <div className="space-y-10 divide-y divide-gray-900/10 bg-gray-50 p-10 rounded-md">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
        <div className="px-4 sm:px-0">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Add New Book</h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed on product page so be careful what you add.
          </p>
        </div>

        <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2" encType='multipart/form-data'>
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
                  onChange={(e) => handleInputChange(e)}
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Fantasy"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-4">
          <label htmlFor="bookQuantity" className="block text-sm font-medium leading-6 text-gray-900">
           Stock Availability/ In-Stock Quantity
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="number"
                name="bookQuantity"
                id="bookQuantity"
                onChange={(e) => handleInputChange(e)}
                className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="100"
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
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddBook}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}
