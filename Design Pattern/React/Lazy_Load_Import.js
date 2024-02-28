const PIZZA = "PIZZA";
const CAKE = "CAKE";

const componentMapping = {
  [PIZZA]: React.lazy(() => import("../components/pizza")),
  [CAKE]: React.lazy(() => import("../components/cake")),
};

const Component = componentMapping(PIZZA);

return <Component />;
