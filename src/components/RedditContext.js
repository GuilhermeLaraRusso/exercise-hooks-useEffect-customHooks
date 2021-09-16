import React, { createContext, useEffect, useState } from "react";

import { getPostsBySubreddit } from "../services/redditAPI";

const Context = createContext();

const INITIAL_POSTS_BY_SUBREDDIT = {
  frontend: {},
  reactjs: {},
};

function RedditProvider({ children }) {
  const [postsBySubreddit, setPostsBySubreddit] = useState(INITIAL_POSTS_BY_SUBREDDIT);
  const [selectedSubreddit, setSelectedSubreddit] = useState('reactjs');
  const [shouldRefreshSubreddit, setShouldRefreshSubreddit] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const shouldFetchPosts = () => {
    const posts = postsBySubreddit[selectedSubreddit];

    if(!posts.items) return true;
    if(isFetching) return false;
    return shouldRefreshSubreddit;
  };

  const handleFetchSuccess = (json) => {
    const lastUpdated = Date.now();
    const items = json.data.children.map((child) => child.data);
    const newPostsBySubreddit = {
      ...postsBySubreddit,
      [selectedSubreddit]: { items, lastUpdated },
    };

    setPostsBySubreddit(newPostsBySubreddit);
    setShouldRefreshSubreddit(false);
    setIsFetching(false);
  }

  const handleFetchError = (error) => {
    const newPostsBySubreddit = {
      ...postsBySubreddit,
      [selectedSubreddit]: {
        error: error.message,
        item: [],
      },
    };

    setPostsBySubreddit(newPostsBySubreddit);
    setShouldRefreshSubreddit(false);
    setIsFetching(false);
  };

  const fetchPosts = () => {
    if (!shouldFetchPosts()) return;

    setShouldRefreshSubreddit(false);
    setIsFetching(true);

    getPostsBySubreddit(selectedSubreddit)
      .then(handleFetchSuccess, handleFetchError);
  }

  const handleRefreshSubreddit = () => {
    setShouldRefreshSubreddit(true);
  }

  useEffect(() => {
    fetchPosts();
  }, [ selectedSubreddit, shouldRefreshSubreddit ]);

  const context = {
    postsBySubreddit,
    selectedSubreddit,
    shouldRefreshSubreddit,
    isFetching,
    selectSubreddit: setSelectedSubreddit,
    fetchPosts,
    refreshSubreddit: handleRefreshSubreddit,
    availableSubreddits: Object.keys(postsBySubreddit),
    posts: postsBySubreddit[selectedSubreddit].items,
  };

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  )
}

export { RedditProvider as Provider, Context};