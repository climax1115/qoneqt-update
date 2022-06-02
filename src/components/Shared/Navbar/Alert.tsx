import { gql, useLazyQuery } from '@apollo/client'
import useOnClickOutside from '@components/utils/hooks/useOnClickOutside'
import { MinimalProfileFields } from '@gql/MinimalProfileFields'
import consoleLog from '@lib/consoleLog'
import { useRouter } from 'next/router'
import { ChangeEvent, FC, useRef, useState } from 'react'

export const SEARCH_USERS_QUERY = gql`
  query SearchUsers($request: SearchQueryRequest!) {
    search(request: $request) {
      ... on ProfileSearchResult {
        items {
          ...MinimalProfileFields
        }
      }
    }
  }
  ${MinimalProfileFields}
`

interface Props {
  hideDrodown?: boolean
}

const Alert: FC<Props> = ({ hideDrodown = false }) => {
  const { push, pathname, query } = useRouter()
  const [searchText, setSearchText] = useState<string>('')
  const dropdownRef = useRef(null)

  useOnClickOutside(dropdownRef, () => setSearchText(''))

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] =
    useLazyQuery(SEARCH_USERS_QUERY, {
      onCompleted(data) {
        consoleLog(
          'Lazy Query',
          '#8b5cf6',
          `Fetched ${data?.search?.items?.length} search result for ${searchText}`
        )
      }
    })

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value
    setSearchText(keyword)
    if (pathname !== '/search' && !hideDrodown) {
      searchUsers({
        variables: { request: { type: 'PROFILE', query: keyword, limit: 8 } }
      })
    }
  }

  const handleKeyDown = (evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault()
    if (pathname === '/search') {
      push(`/search?q=${searchText}&type=${query.type}`)
    } else {
      push(`/search?q=${searchText}&type=profiles`)
    }
    setSearchText('')
  }

  return (
    <>
      <div className="flex space-x-4">
        <div className="notification group inline-block relative">
          <button>
            <svg
              className="h-8 w-8 text-gray-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {' '}
              <path stroke="none" d="M0 0h24v24H0z" />{' '}
              <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />{' '}
              <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
            </svg>
          </button>
          <ul className="absolute hidden text-gray-700 pt-1 group-hover:block">
            <li className="">
              <a
                className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                href="#"
              >
                No Notification Found
              </a>
            </li>
          </ul>
        </div>
        <div className="message">
          <svg
            className="h-8 w-8 text-gray-500"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {' '}
            <path stroke="none" d="M0 0h24v24H0z" />{' '}
            <rect x="3" y="5" width="18" height="14" rx="2" />{' '}
            <polyline points="3 7 12 13 21 7" />
          </svg>
        </div>
        <div className="user_status">
          <svg
            className="h-8 w-8 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {' '}
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{' '}
            <circle cx="9" cy="7" r="4" />{' '}
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />{' '}
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <svg
            className="h-8 w-8 text-gray-500"
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
        </div>
      </div>
    </>
  )
}

export default Alert
