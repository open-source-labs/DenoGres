import { useEffect, useState } from "preact/hooks";

export default function LogOut() {
  const [count, setCount] = useState<number>(3);

  const updateCount = () => {
    setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);
  };

  useEffect(() => {
    const logout = async () => {
      setTimeout(() => window.location.href = "/gui/", 3000);
      await fetch("/gui/api/handleRequests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "clear user cache" }),
      });
      await fetch("/gui/api/logOut");
    };
    logout();
    updateCount();
  }, []);

  return (
    <div className="w-full flex flex-row">
      <div className="w-full bg-white rounded mx-3 p-3 items-center">
        {/* <h2 className="mb-3">LogOut</h2> */}
        <p>Thank you for using DenoGres. Logging out...</p>
        <p>
          Blasting off in <span className="font-bold text-lg">{count}</span>
          {" "}
          seconds!!
        </p>
      </div>
    </div>
  );
}
