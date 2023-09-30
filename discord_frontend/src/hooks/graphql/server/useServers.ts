import { useQuery } from "@apollo/client"

import { GET_SERVERS } from "../../../graphql/queries/GetServers"
import { GetServersQuery, GetServersQueryVariables } from "../../../gql/graphql"

export function useServers() {
  const { data: servers, loading } = useQuery<
    GetServersQuery,
    GetServersQueryVariables
  >(GET_SERVERS)

  return { servers: servers?.getServers, loading }
}
