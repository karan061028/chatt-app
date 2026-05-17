import { useState } from "react";

const Login = ({ setUser }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!username || !password) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/${isSignup ? "signup" : "login"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (data.token || isSignup) {
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        setUser({ username });
      } else {
        alert(data.msg || "Error");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  // GOOGLE LOGIN PLACEHOLDER
 const handleGoogleLogin = () => {
  alert("Google authentication will be available soon ✨");
};

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020617]">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl top-[-100px] left-[-100px]" />

      <div className="absolute w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />

      {/* CARD */}
      <div
        className="
        relative z-10
        w-full max-w-md
        p-8 rounded-3xl
        bg-white/10
        backdrop-blur-2xl
        border border-white/10
        shadow-[0_0_40px_rgba(16,185,129,0.15)]
        text-white
      "
      >

        {/* LOGO */}
        <div className="flex justify-center mb-5">
          <div
            className="
            w-16 h-16
            rounded-2xl
            bg-gradient-to-br
            from-green-400
            to-emerald-600
            flex items-center justify-center
            text-3xl
            shadow-lg
          "
          >
            💬
          </div>
        </div>

        {/* HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold tracking-tight">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>

          <p className="text-gray-300 mt-2 text-sm">
            {isSignup
              ? "Start chatting with your friends instantly 🚀"
              : "Login to continue your conversations"}
          </p>
        </div>

        {/* USERNAME */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 mb-2 block">
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="
              w-full
              p-4
              rounded-2xl
              bg-[#0f172a]/80
              border border-white/10
              focus:border-green-400
              focus:ring-2
              focus:ring-green-400/30
              outline-none
              transition-all duration-300
            "
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="text-sm text-gray-300 mb-2 block">
            Password
          </label>

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full
                p-4
                rounded-2xl
                bg-[#0f172a]/80
                border border-white/10
                focus:border-green-400
                focus:ring-2
                focus:ring-green-400/30
                outline-none
                transition-all duration-300
              "
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-xl
                hover:scale-110
                transition
              "
            >
              {showPass ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleAuth}
          disabled={loading}
          className="
            w-full
            py-4
            rounded-2xl
            bg-gradient-to-r
            from-green-400
            to-emerald-500
            text-black
            font-bold
            text-lg
            hover:scale-[1.02]
            active:scale-[0.98]
            transition-all
            duration-300
            shadow-lg
          "
        >
          {loading
            ? "Please wait..."
            : isSignup
            ? "Create Account"
            : "Login"}
        </button>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-white/10"></div>

          <span className="text-gray-400 text-sm">
            OR
          </span>

          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          className="
            w-full
            py-4
            rounded-2xl
            bg-white
            text-black
            flex items-center justify-center gap-3
            hover:bg-gray-100
            transition-all duration-300
            font-medium
          "
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="Google"
          />

          Continue with Google
        </button>

        {/* TOGGLE */}
        <p className="text-center mt-7 text-sm text-gray-400">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}{" "}

          <span
            onClick={() => setIsSignup(!isSignup)}
            className="
              text-green-400
              cursor-pointer
              hover:text-green-300
              transition
              font-medium
            "
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;