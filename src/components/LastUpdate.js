import React, { useContext } from 'react';

import { Context } from './RedditContext';

const LastUpdate = () => {
  const { selectedSubreddit, postsBySubreddit } = useContext(Context);
  const { lastUpdate } = postsBySubreddit[selectedSubreddit];

  if (!lastUpdate) return null;

  return (
    <span>
      {`Last updated at ${new Date(lastUpdate).toLocaleDateString()}.`}
    </span>
  );
};

export default LastUpdate;
