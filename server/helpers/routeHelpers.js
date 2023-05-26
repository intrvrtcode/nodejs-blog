function isActiveRoute(route, currentRoute) {
  return route === currentRoute ? 'active' : '';
}

function addGreeting() {
  let timeNow = new Date((new Date).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta"
})).getHours();
  console.log(timeNow);
  let greeting =
  timeNow >= 5 && timeNow < 12
    ? "Good Morning"
    : timeNow >= 12 && timeNow < 18
    ? "Good Afternoon"
    : "Good evening";

    return greeting;
}

module.exports = {isActiveRoute, addGreeting};