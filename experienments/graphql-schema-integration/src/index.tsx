import React from 'react';
import { useQuery } from '@apollo/client';
import hqNameQuery from './hqName.query.gql';

import { gql } from './__generated__/gql';

const GET_HQ_NAME = gql(hqNameQuery);

export function HqInformation() {
  // our query's result, data, is typed!
  const { loading, data } = useQuery(GET_HQ_NAME);

  return (
    <div>
      <h3>HQ Information</h3>
      {loading ? (
        <p>Loading ...</p>
      ) : (
        <div>
          <h1>{data.restaurant.hqInfo.hqDetail.hqName}</h1>
        </div>
      )}
    </div>
  );
}
