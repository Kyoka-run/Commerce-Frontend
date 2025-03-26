import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { AiOutlineLogin } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../shared/InputField";
import { authenticateSignInUser } from "../../store/actions";
import toast from "react-hot-toast";
import Spinners from "../shared/Spinners";

const Login = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
        // Valid when submit
        mode: "onSubmit",
    });

    const loginHandler = async (data) => {
        console.log("Login Click");
        // reset form react-hook-form to reset form after submit
        dispatch(authenticateSignInUser(data, toast, reset, navigate, setLoader));
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center" data-testid="login-container">
            <form
                onSubmit={handleSubmit(loginHandler)}
                className="sm:w-[450px] w-[360px] shadow-custom py-8 sm:px-8 px-4 rounded-md"
                data-testid="login-form">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <AiOutlineLogin className="text-slate-800 text-5xl"/>
                        <h1 className="text-slate-800 text-center font-montserrat lg:text-3xl text-2xl font-bold" data-testid="login-heading">
                            Login Here
                        </h1>
                    </div>
            <hr className="mt-2 mb-5 text-black" />
            <div className="flex flex-col gap-3">
                <InputField
                    label="UserName"
                    required
                    id="username"
                    type="text"
                    message="*UserName is required"
                    placeholder="Enter your username"
                    register={register}
                    errors={errors}
                    testId="username-input"
                    />

                <InputField
                    label="Password"
                    required
                    id="password"
                    type="password"
                    message="*Password is required"
                    placeholder="Enter your password"
                    register={register}
                    errors={errors}
                    testId="password-input"
                    />
            </div>

            <button
                // Prevent multiple clicks
                disabled={loader}
                className="bg-button-gradient flex gap-2 items-center justify-center font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
                type="submit"
                data-testid="login-button">
                {loader ? (
                    <>
                    <Spinners /> Loading...
                    </>
                ) : (
                    <>Login</>
                )}
            </button>

            <p className="text-center text-sm text-slate-700 mt-6">
              Don't have an account?
              <Link
                className="font-semibold underline hover:text-black"
                to="/register"
                data-testid="signup-link">
              <span> SignUp</span></Link>  
            </p>
            </form>
        </div>
    );
}

export default Login;