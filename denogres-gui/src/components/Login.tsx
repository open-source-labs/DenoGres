import React, { useState } from "react";

export interface loginStatus {
  show: boolean;
  text: string;
}

interface reqBody {
  username: string;
  password: string;
}

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginStatus, setLoginStatus] = useState<loginStatus>({
    show: false,
    text: "",
  });

  const labelStyle = "py-3";
  const inputStyle =
    "my-3 py-2 px-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12";

  const login = async (e?: Event): Promise<void> => {
    if (username === "" || password === "") {
      setLoginStatus({
        show: true,
        text: "Username/Password fields cannot be blank. Please try again.",
      });
    } else {
      const reqBody: reqBody = {
        username,
        password,
      };

      const response = await fetch("api/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });

      if (response.ok) {
        window.location.href = "/gui/home";
      } else {
        const data = await response.json();
        setLoginStatus({ show: true, text: data.err });
      }
    }
  };

  const signup = async (): Promise<void> => {
    const reqBody: reqBody = {
      username,
      password,
    };

    const response = await fetch("gui/api/signUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });

    if (response.ok) {
      login();
    } else {
      setLoginStatus({
        show: true,
        text: "That account is already taken. Please try again.",
      });
    }
  };

  const statusStyle: string = "text-red-600 z-50" +
    ((loginStatus.show) ? " visible" : " invisible");

  const statusText: string = loginStatus.text;

  return (
    <div className="flex flex-col px-5 z-10 w-5/12 h-96 m-auto bg-deno-blue-100 drop-shadow-2xl rounded">
      <div className="flex-1">
        <h2 className="py-5 font-extrabold text-lg">
          Denogres Login
        </h2>
        <label className={labelStyle}>Username:</label>
        <input
          className={inputStyle}
          onInput={(e) => {
            setUsername(e.currentTarget.value);
          }}
          value={username}
        >
        </input>
        <label className={labelStyle}>Password</label>
        <input
          className={inputStyle}
          onInput={(e) => {
            setPassword(e.currentTarget.value);
          }}
          value={password}
          type="password"
        >
        </input>
        <div
          className={statusStyle}
        >
          {statusText}
        </div>
      </div>
      <div className="flex flex-row justify-end pb-5">
        <button
          className="px-5 mx-1 py-3 text-sm font-medium tracking-wider text-gray-700 rounded-full hover:shadow-2xl hover:bg-deno-blue-200"
          onClick={login}
        >
          Login
        </button>
        <button
          className="px-5 mx-1 py-3 text-sm font-medium tracking-wider text-gray-700 rounded-full hover:shadow-2xl hover:bg-deno-blue-200"
          onClick={signup}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
