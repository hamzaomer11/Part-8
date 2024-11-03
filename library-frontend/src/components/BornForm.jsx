import { useState, useEffect } from 'react'
import Select from 'react-select'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from '../../queries'

const BornForm = () => {
  const [born, setBorn] = useState('')
  const [selectedOption, setSelectedOption] = useState([])

  const authorData = useQuery(ALL_AUTHORS)

  const [changeBirthYear, result ] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [ {query: ALL_AUTHORS} ]
    })

  useEffect(() => {
    if (authorData) {
      const options = authorData.data.allAuthors.map(author => {
        return { value: author.name, label: author.name }
      })
      setSelectedOption(options)
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()

    changeBirthYear({ variables: { name: event.target.author.value, born } })
    setBorn('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
        <div>
          <Select
            options={selectedOption}
            name='author'
          >
          </Select>
        </div>
        <div>
          born 
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default BornForm