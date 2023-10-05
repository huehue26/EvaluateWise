import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

function Login() {
  const [userid, setuserid] = useState("");
  const [pass, setpass] = useState("");
  const [err, seterr] = useState("");
  const { t } = useTranslation();

  const router = useRouter();

  const loginHandler = async () => {
    const response = await axios.post("/api/login", {
      user_id: userid,
      password: pass,
    });
    console.log(response.data);
    if (response.data.user) {
      router.push("/");
    } else {
      seterr(response.data.message);
    }
  };

  return (
    <div className="h-screen w-screen fixed inset-0 bg-white">
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {t("Sign in to your account")}
              </h1>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("User Id")}
                  </label>
                  <input
                    type="text"
                    name="userid"
                    id="userid"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="1234abcd"
                    value={userid}
                    required=""
                    onChange={(e) => setuserid(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("Password")}
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                    value={pass}
                    onChange={(e) => setpass(e.target.value)}
                  />
                </div>
                <div className="text-red-500 text-sm">{err}</div>
                {/* <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div
                      className="ml-3 text-sm"
                      onClick={() => navigate("/forgot-password")}
                    >
                      <label
                        htmlFor="remember"
                        className="text-gray-700 dark:text-gray-300 cursor-pointer hover:underline"
                      >
                        {t("Forgot Password")}?
                      </label>
                    </div>
                  </div>
                </div> */}
                <button
                  type="submit"
                  className="w-full text-slate-100 bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={() => loginHandler()}
                >
                  {t("Sign in")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
