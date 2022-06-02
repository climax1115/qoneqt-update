import { gql, useQuery } from '@apollo/client'
import MyLoopsProfile from '@components/Shared/MyLoopsProfile'
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer'
import CustomList from '@components/Shared/CustomList'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import AppContext from '@components/utils/AppContext'
import { Profile } from '@generated/types'
import { MinimalProfileFields } from '@gql/MinimalProfileFields'
import { UsersIcon } from '@heroicons/react/outline'
import { LightningBoltIcon, SparklesIcon } from '@heroicons/react/solid'
import consoleLog from '@lib/consoleLog'
import randomizeArray from '@lib/randomizeArray'
import React, { FC, useContext } from 'react'

const RECOMMENDED_PROFILES_QUERY = gql`
  query RecommendedProfiles {
    recommendedProfiles {
      ...MinimalProfileFields
    }
  }
  ${MinimalProfileFields}
`

const SuggestedLoopsTitle = () => {
  const { currentUser } = useContext(AppContext)

  return (
    <div className="mt-5 flex gap-2 items-center px-5 mb-2 sm:px-0">
      {currentUser ? (
        <>
          <SparklesIcon className="w-4 h-4 text-yellow-500" />
          <div>Who to follow</div>
        </>
      ) : (
        <>
          <LightningBoltIcon className="w-4 h-4 text-yellow-500" />
          <div>Suggested Loops</div>
        </>
      )}
    </div>
  )
}

const MyLoopsTitle = () => {
  const { currentUser } = useContext(AppContext)

  return (
    <div className="flex gap-2 items-center px-5 mb-2 sm:px-0">
      {currentUser ? (
        <>
          <SparklesIcon className="w-4 h-4 text-yellow-500" />
          <div>Who to follow</div>
        </>
      ) : (
        <>
          <LightningBoltIcon className="w-4 h-4 text-yellow-500" />
          <div>
            My Loops
            <button
              id="dropdownDefault"
              data-dropdown-toggle="dropdown"
              className="ml-32 text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
              type="button"
            >
              <svg
                className="h-4 w-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {' '}
                <circle cx="11" cy="11" r="8" />{' '}
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const RecommendedProfiles: FC = () => {
  const { data, loading, error } = useQuery(RECOMMENDED_PROFILES_QUERY, {
    onCompleted(data) {
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched ${data?.recommendedProfiles?.length} recommended profiles`
      )
    }
  })

  if (loading)
    return (
      <>
        <SuggestedLoopsTitle />
        <Card>
          <CardBody className="space-y-4">
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
          </CardBody>
        </Card>
      </>
    )

  if (data?.recommendedProfiles?.length === 0)
    return (
      <>
        <SuggestedLoopsTitle />
        <EmptyState
          message={
            <div>
              <span>No recommendations!</span>
            </div>
          }
          icon={<UsersIcon className="w-8 h-8 text-brand" />}
        />
      </>
    )

  return (
    <>
      <MyLoopsTitle />
      <Card>
        <CardBody className="space-y-4">
          <ErrorMessage title="Failed to recommendations" error={error} />
          {randomizeArray(data?.recommendedProfiles)
            ?.slice(0, 5)
            ?.map((profile: Profile) => (
              <MyLoopsProfile key={profile?.id} profile={profile} showFollow />
            ))}
        </CardBody>
      </Card>

      <SuggestedLoopsTitle />
      <Card>
        <CardBody className="space-y-4">
          <ErrorMessage title="Failed to recommendations" error={error} />
          {randomizeArray(data?.recommendedProfiles)
            ?.slice(0, 5)
            ?.map((profile: Profile) => (
              <CustomList key={profile?.id} profile={profile} showFollow />
            ))}
        </CardBody>
      </Card>
    </>
  )
}

export default RecommendedProfiles
