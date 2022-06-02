import { gql, useQuery } from '@apollo/client'
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer'
import UserProfile from '@components/Shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import AppContext from '@components/utils/AppContext'
import { Profile } from '@generated/types'
import { MinimalProfileFields } from '@gql/MinimalProfileFields'
import { UsersIcon } from '@heroicons/react/outline'
import { LightningBoltIcon, SparklesIcon } from '@heroicons/react/solid'
import { Button } from '@components/UI/Button'
import { UserAddIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import randomizeArray from '@lib/randomizeArray'
import React, { FC, useContext } from 'react'
import CustomList from '@components/Shared/CustomList'

const RECOMMENDED_PROFILES_QUERY = gql`
  query RecommendedProfiles {
    recommendedProfiles {
      ...MinimalProfileFields
    }
  }
  ${MinimalProfileFields}
`

const LoopsTitle = () => {
  const { currentUser } = useContext(AppContext)

  return (
    <div className="flex gap-2 items-center px-5 mb-2 sm:px-0">
      {currentUser ? (
        <>
          <SparklesIcon className="w-4 h-4 text-yellow-500" />
          <div>Which loops to join</div>
        </>
      ) : (
        <>
          <LightningBoltIcon className="w-4 h-4 text-yellow-500" />
          <div>
            Trending Loops
            <button
              id="dropdownDefault"
              data-dropdown-toggle="dropdown"
              className="ml-36 text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
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
            {'  '}
            <button
              id="dropdownDefault"
              data-dropdown-toggle="dropdown"
              className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
              type="button"
            >
              <svg
                className="h-4 w-4 text-yellow"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                {' '}
                <path stroke="none" d="M0 0h24v24H0z" />{' '}
                <line x1="12" y1="5" x2="12" y2="19" />{' '}
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const CategoriesTitle = () => {
  const { currentUser } = useContext(AppContext)

  return (
    <div className="flex gap-2 items-center px-5 mb-2 sm:px-0">
      {currentUser ? (
        <>
          <SparklesIcon className="w-4 h-4 text-yellow-500" />
          <div>Which loops to join</div>
        </>
      ) : (
        <>
          <LightningBoltIcon className="w-4 h-4 text-yellow-500" />
          <div>
            Recommended Users
            {/* <Button
              className="ml-14 text-sm !px-3 !py-1.5"
              outline
              //   onClick={createFollow}
              //   disabled={
              //     typedDataLoading ||
              //     signLoading ||
              //     writeLoading ||
              //     broadcastLoading
              //   }
              variant="warning"
              aria-label="Follow"
              //   icon={

              //   }
            >
              View All
            </Button> */}
          </div>
        </>
      )}
    </div>
  )
}

const Loops: FC = () => {
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
        <LoopsTitle />
        <Card>
          <CardBody className="space-y-4">
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
          </CardBody>
        </Card>
        <CategoriesTitle />
      </>
    )

  if (data?.recommendedProfiles?.length === 0)
    return (
      <>
        <LoopsTitle />
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
      <LoopsTitle />
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
      <CategoriesTitle />
      <Card>
        <CardBody className="space-y-4">
          <ErrorMessage title="Failed to recommendations" error={error} />
          {randomizeArray(data?.recommendedProfiles)
            ?.slice(0, 5)
            ?.map((profile: Profile) => (
              <UserProfile key={profile?.id} profile={profile} showFollow />
            ))}
        </CardBody>
      </Card>
    </>
  )
}

export default Loops
