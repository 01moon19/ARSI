function Input({ type, placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-4 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-black"
    />
  );
}

export default Input;