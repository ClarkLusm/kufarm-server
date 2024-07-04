import React from 'react';
import { NextPage } from 'next';
import { Request } from 'express';

export async function getServerSideProps({ req }) {
  console.warn(req);
  
  return {
    // props: { user: (req as Request)?.user },
    props: {}
  };
}

const Profile: NextPage = (props) => {
  // const { user } = props;

  // return <h1>Profile {JSON.stringify(user)}</h1>;
  return <span></span>
};

export default Profile;
