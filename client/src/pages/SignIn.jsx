import { useState } from "react";
import axios from "axios";
import { loginUser, registerUser } from "../services/authService";
import "./SignIn.css";

function Login({ setIsLoggedIn, setRole }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [isSignup, setIsSignup] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignup) {
        const res = await registerUser(form);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        setRole(res.data.user.role);
        setIsLoggedIn(true);

        alert("Signup Successful 🎉");
      }

      else {
        // LOGIN
        const res = await loginUser({
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        setRole(res.data.user.role);
        setIsLoggedIn(true);
      }
    }
    catch (error) {
      console.log(error);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>{isSignup ? "Signup" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          {isSignup && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
              <br />
            </>
          )}
          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />
          <br />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />
          <br />

          {/* ROLE */}
          {isSignup && (
            <div className="role-container">
              <p className="role-title">Select Your Role</p>

              <div className="role-options">
                <div
                  className={`role-card ${form.role === "client" ? "active" : ""}`}
                  onClick={() =>
                    setForm({
                      ...form,
                      role: "client",
                    })
                  }
                >
                  👨‍💼 Client
                </div>

                <div
                  className={`role-card ${form.role === "freelancer" ? "active" : ""}`}
                  onClick={() =>
                    setForm({
                      ...form,
                      role: "freelancer",
                    })
                  }
                >
                  👨‍💻 Freelancer
                </div>
              </div>
            </div>
          )}

          <button type="submit">
            {isSignup ? "Signup" : "Login"}
          </button>

          <p
            className="toggle-text"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Signup"}
          </p>

        </form>
      </div>
    </div>
  );
}

export default Login;