function Login() {
  return (
    <div className="flex justify-center items-center h-screen">

      <div className="bg-white p-8 shadow rounded">

        <h2 className="text-2xl mb-4">Admin Login</h2>

        <input
          className="border p-2 mb-3 w-full"
          placeholder="Email"
        />

        <input
          className="border p-2 mb-3 w-full"
          placeholder="Password"
          type="password"
        />

        <button className="bg-blue-500 text-white px-4 py-2 w-full">
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;