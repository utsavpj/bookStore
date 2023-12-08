import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home({ userData }) {
  const [products, setProducts] = useState([]);
  const [itemAdded, setItemAdded] = useState();
  const [quantity, setQuantity] = useState({});

  const handleAddToBag = async (product) => {
    try {
      const bookQuantity = quantity[product._id] || 1;
      // Make API call to store book data
      const response = await fetch(
        "http://localhost:8080/customer/add-toCart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: userData.token,
          },
          body: JSON.stringify({
            customerId: userData._id,
            bookId: product._id,
            quantity: bookQuantity,
          }),
        }
      );

      if (response.ok) {
        setItemAdded({
          ...itemAdded,
          [product._id]: true,
        });
      } else {
        console.log(response);
        toast.error("Failed to in cart");
      }
    } catch (error) {
      console.error("Error during book addition:", error);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Make API call to get all books
        const response = await fetch("http://localhost:8080/books"); // Update the URL with your actual API endpoint

        if (response.ok) {
          const booksData = await response.json();
          console.log(booksData);
          setProducts(booksData.books);
        } else {
          console.error("Failed to fetch books:", response.statusText);
        }
      } catch (error) {
        console.error("Error during book fetch:", error);
      }
    };

    // Call the fetchBooks function
    fetchBooks();
  }, []);

  const handleQuantityChange = (bookId, qty) => {
    setQuantity((prevQuantity) => ({
      ...prevQuantity,
      [bookId]: qty,
    }));
  };

  return (
    <div>
      {products ? (
        <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8 ">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">
            Book Lists
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-4 xl:gap-x-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-md border-gray-300 px-1 py-2"
              >
                <div className="relative">
                  <div className="relative h-80 w-full overflow-hidden rounded-lg ">
                    <img
                      src={`data:image/*;base64,${product.bookImage}`}
                      alt={`${product.bookName} Image`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="relative mt-4 px-1">
                    <h3 className="text-md font-medium text-gray-900">
                      {product.bookName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      By {product.bookAuthor}
                    </p>

                    <select
                      id={`quantity-${product.quantity}`}
                      name={`quantity-${product.quantity}`}
                      className="max-w-full mt-1 rounded-md border border-gray-300 py-1 text-left text-xs font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                      onChange={(e) =>
                        handleQuantityChange(product._id, e.target.value)
                      }
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                    </select>
                  </div>
                  <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                    />
                    <p className="relative text-lg font-semibold text-white">
                      $ {product.bookPrice}
                    </p>
                  </div>
                </div>
                <span className="mt-1 px-1 text-xs text-gray-400">
                  {product.bookDescription}
                </span>
                <div className="mt-6">
                  <button
                    onClick={() => handleAddToBag(product)}
                    className={`relative flex items-center justify-center rounded-md border border-transparent w-full px-8 py-2 text-sm font-bold ${
                      itemAdded && itemAdded[product._id]
                        ? "bg-green-500 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-500"
                    }`}
                  >
                    {itemAdded && itemAdded[product._id]
                      ? "Added"
                      : "Add to bag"}
                    <span className="sr-only">, {product.name}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>Loading</>
      )}
    </div>
  );
}
