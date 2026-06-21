import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Create from "../pages/create/page";
import CreateSelect from "../pages/create-select/page";
import CreateChat from "../pages/create-chat/page";
import CreateProgress from "../pages/create-progress/page";
import StoryViewer from "../pages/viewer/page";
import Playground from "../pages/report/page";
import Comprehension from "../pages/report/comprehension/page";
import Emotion from "../pages/report/emotion/page";
import Creative from "../pages/report/creative/page";
import Bookshelf from "../pages/bookshelf/page";
import BookshelfPremium from "../pages/bookshelf/premium/page";
import Dashboard from "../pages/dashboard/page";
import Vocabulary from "../pages/report/vocabulary/page";
import Settings from "../pages/settings/page";
import ProfileEdit from "../pages/profile/edit/page";
import Subscription from "../pages/subscription/page";
import DummyBooks from "../pages/dummy-books/page";
import DummyViewer from "../pages/dummy-viewer/page";
import Result from "../pages/result/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/create",
    element: <Create />,
  },
  {
    path: "/create/select",
    element: <CreateSelect />,
  },
  {
    path: "/create/chat",
    element: <CreateChat />,
  },
  {
    path: "/create/progress",
    element: <CreateProgress />,
  },
  {
    path: "/viewer",
    element: <StoryViewer />,
  },
  {
    path: "/report",
    element: <Playground />,
  },
  {
    path: "/report/comprehension",
    element: <Comprehension />,
  },
  {
    path: "/report/emotion",
    element: <Emotion />,
  },
  {
    path: "/report/creative",
    element: <Creative />,
  },
  {
    path: "/bookshelf",
    element: <Bookshelf />,
  },
  {
    path: "/bookshelf/premium",
    element: <BookshelfPremium />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/report/vocabulary",
    element: <Vocabulary />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/profile/edit",
    element: <ProfileEdit />,
  },
  {
    path: "/subscription",
    element: <Subscription />,
  },
  {
    path: "/result",
    element: <Result />,
  },
  {
    path: "/dummy-books",
    element: <DummyBooks />,
  },
  {
    path: "/dummy-viewer",
    element: <DummyViewer />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
