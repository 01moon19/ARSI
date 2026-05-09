function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
    >
      {children}
    </button>
  );
}

export default Button;