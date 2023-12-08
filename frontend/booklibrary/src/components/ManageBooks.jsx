import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import UpdateBook from './UpdateBook'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';



export default function ManageBooks({userData}) {
  const [isUpdate , setUpdate] = useState(false);

  const [products, setProducts] = useState([]);
  const [bookData, setBookData] = useState();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Make API call to get all books
        const response = await fetch('http://localhost:8080/books'); // Update the URL with your actual API endpoint

        if (response.ok) {
          const booksData = await response.json();
          console.log(booksData)
          setProducts(booksData.books);
        } else {
          console.error('Failed to fetch books:', response.statusText);
        }
      } catch (error) {
        console.error('Error during book fetch:', error);
      }
    };

    // Call the fetchBooks function
    fetchBooks();
  }, [products]); 

  const handleBookUpdate = (bookData) => {
    setBookData(bookData)
    setUpdate(true);
  }

  const handleBookDelete = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/books/DeleteBook/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: userData.token,
        },
      });

      if (response.ok) {
        // Remove the deleted book from the state
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
        toast.success('Book deleted successfully');
      } else {
        const errorMessage = await response.text();
        console.error('Failed to delete book:', errorMessage);
        toast.error(`Failed to delete book: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error during book deletion:', error);
    }
  }

  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pb-24">
    <h2 className="px-4 sm:px-6 sm:py-10 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
    Manage Books
    </h2>
    {products ?
    <ul role="list" className="px-4 sm:px-6 sm:py-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:px-8">
      {products.map((product) => (
        <li
          key={product._id}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-8">
     
            <img
  src={`data:image/*;base64,${product.bookImage}`}
  alt={`${product.bookName} Image`}
  className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" 
/>


            <h3 className="mt-6 text-sm font-medium text-gray-900">{product.bookName}</h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Author</dt>
              <dd className="text-sm text-gray-500">By {product.bookAuthor}</dd>
              <dd className="text-xs text-gray-500">{product.bookCategory}</dd>
              <dt className="sr-only">Availblity</dt>
              <dd className="mt-3">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                 Price: $ {product.bookPrice}
                </span>
              </dd>
            </dl>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <button
                  onClick={() => handleBookUpdate(product)}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                >
                  <PencilIcon className="h-5 w-5 text-gray-400 " aria-hidden="true" />
                  Update
                </button>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <button
                  onClick={() => handleBookDelete(product._id)}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                >
                  <TrashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul> : <>Loading...</>
      }
    { isUpdate && <UpdateBook onClose={() => setUpdate(!isUpdate)} bookData={bookData} userData={userData}/>}
    </div>
  )
}
