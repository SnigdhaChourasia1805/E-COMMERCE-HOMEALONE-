import { NavLink } from "react-router-dom";

export const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <NavLink
            key={product._id}
            to={`/products/${product._id}`}
            className={({ isActive }) =>
              `block ${isActive ? "ring-2 ring-red-400" : ""}`
            }
          >
            <div className="bg-white p-4 rounded-lg">
              <div className="w-full h-96 mb-4">
                <img
                  src={product.images?.[0]?.url || "/placeholder.jpg"}
                  alt={product.images?.[0]?.altText || product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-sm mb-2">{product.name}</h3>
                <p className="text-gray-500 font-medium text-sm tracking-tighter">
                  ₹{product.price}
                </p>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </>
  );
};
