import { useEffect, useState } from "react";

function Clock() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);

    return function () {
      clearInterval(timerId);
    };
  }, [date]);

  const tick = () => {
    setDate(new Date());
  };

  return <h1>The time is {date.toLocaleTimeString()}</h1>;
}

export default Clock;
