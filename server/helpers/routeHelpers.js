function isActiveRoute(route, currentRoute) {
  return route === currentRoute ? 'active' : '';
}

function addGreeting() {
  let timeNow = new Date().getHours();
  console.log(new Date());
  let greeting =
  timeNow >= 5 && timeNow < 12
    ? "Good Morning"
    : timeNow >= 12 && timeNow < 18
    ? "Good Afternoon"
    : "Good evening";

    return greeting;
}

module.exports = {isActiveRoute, addGreeting};