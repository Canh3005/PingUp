import React from "react";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import { useAuth } from "./context/authContext.jsx";
import Home from "./pages/Home.jsx";
import Feed from "./pages/Feed.jsx";
import Connection from "./pages/Connection.jsx";
import Message from "./pages/Message.jsx";
import Profile from "./pages/Profile.jsx";
import ChatBox from "./pages/ChatBox.jsx";
import Discover from "./pages/Discover.jsx";
import Layout from "./pages/Layout.jsx";
import OnBoarding from "./pages/OnBoarding.jsx";
import TopicSelection from "./pages/TopicSelection.jsx";
import ProjectEditor from "./pages/ProjectEditor.jsx";
import ProjectView from "./pages/ProjectView.jsx";

const App = () => {

  const { user } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/" element={ !user ? <Home /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="onboarding" element={<OnBoarding />} />
          <Route path="topic-selection" element={<TopicSelection />} />
          <Route path="connection" element={<Connection />} />
          <Route path="message" element={<Message />} />
          <Route path="message/:userId" element={<ChatBox />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-project" element={<ProjectEditor />} />
          <Route path="project/:projectId" element={<ProjectView />} />
          <Route path="discover" element={<Discover />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
