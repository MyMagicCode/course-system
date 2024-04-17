"use client";
import { MD5 } from "crypto-js";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [codeObj, setCodeObj] = useState<{ url: string; uuid: string }>({
    url: "",
    uuid: "",
  });
  const route = useRouter();

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = () => {
    fetch("/api/auth/code")
      .then((res) => res.json())
      .then((res) => {
        setCodeObj(res);
      });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const payload = Object.fromEntries(data);
      // MD5 32位小写加密
      payload.password = MD5(payload.password as string).toString();
      payload.uuid = codeObj.uuid;
      const res = await signIn("credentials", {
        ...payload,
        redirect: false,
      });
      if (!res?.ok) {
        setErrorMsg(res?.error || "登录失败！");
        setIsError(true);
        handleRefresh()
      } else {
        route.push("/timetable");
      }
    } catch (e) {
      console.log("e", e);
    }
  };

  return (
    <div className="h-full w-full overflow-hidden bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="mt-[200px] max-w-sm mx-auto p-4 rounded-xl shadow-lg bg-white">
        <p className="text-2xl font-bold text-center text-gray-900">用户登录</p>
        <div className="mt-4">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900 ">
            账号:
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="请输入"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            required
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 ">
            密码
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            required
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="verification"
            className="block mb-2 text-sm font-medium text-gray-900 ">
            验证码
          </label>
          <div className="flex items-center">
            <input
              type="text"
              name="verification"
              id="verification"
              placeholder="请输入"
              className="bg-gray-50 h-[42px] border w-[40%] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
              required
            />
            <div
              className="w-[60%] cursor-pointer flex justify-center"
              onClick={handleRefresh}>
              {codeObj.url ? (
                <img
                  className="w-[80%] h-[56px]"
                  src={codeObj.url}
                  alt="验证码"
                />
              ) : (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center mt-2 mb-2"></div>

        {isError ? (
          <div
            id="toast-danger"
            className="flex items-center w-full  p-4 mb-4 text-gray-500 bg-white rounded-lg shadow"
            role="alert">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg ">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
              </svg>
              <span className="sr-only">Error icon</span>
            </div>
            <div className="ms-3 text-sm font-normal">{errorMsg}</div>
            <button
              type="button"
              onClick={() => {
                setIsError(false);
              }}
              className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 "
              data-dismiss-target="#toast-danger"
              aria-label="Close">
              <span className="sr-only">Close</span>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
        ) : null}
        <button
          type="submit"
          className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ">
          登录
        </button>
      </form>
    </div>
  );
}
