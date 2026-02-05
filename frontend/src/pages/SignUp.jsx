import { useState } from "react";
import { Link, useNavigate } from "react-router";
import PasswordInput from "../components/input/PasswordInput";
import { validateEmail } from "../lib/helper";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

const Signup = () => {

    const [fullName, setfullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        
        if (!fullName) {
            setError("Enter your name");
            return;
        }

        if (!validateEmail(email)) {
            setError("Invalid email address");
            return;
        }

        if (!password) {
            setError("Invalid password");
            return;
        }


        setLoading(true);

        try {
            await axiosInstance.post("/users/signup", {
                fullName,
                email,
                password
            });

            toast.success("Account created successfully");
            navigate("/login");

        } catch (error) {
            if (error.response.status === 429) {
                toast.error(
                    "Too many requests. Please try again later.",
                    { duration: 4000, icon: "⏳" }
                );
            } else if (error.response.status === 409) {
                toast.error("User with this email already exists")
                navigate("/login")
            }
            else {
                toast.error("Failed to create account. Please try again.");
            }
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="w-full max-w-md">
                <h1 className="text-4xl font-bold text-center mb-6 text-primary">
                    NoteKeeper
                </h1>
                <div className="card w-full max-w-md bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl justify-center">
                            Create an Account
                        </h2>

                        <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your Name"
                                    className="input input-bordered"
                                    value={fullName}
                                    onChange={(e) => setfullName(e.target.value)}


                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your Email"
                                    className="input input-bordered"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <PasswordInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

                            <button className="btn btn-primary w-full">
                                {loading ? (<span className="loading loading-spinner"></span>) : ("Sign Up")}
                            </button>
                        </form>

                        <p className="text-center text-sm mt-4">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="link link-primary"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
