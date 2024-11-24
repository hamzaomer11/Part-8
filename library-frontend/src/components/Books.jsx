import { useState } from "react"
import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../../queries"

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState("")

  const result = useQuery(ALL_BOOKS, {
    variables: {genre: selectedGenre},
  })

  if (result.loading) {
    return <div>loading...</div>
  }

  const allGenres = result.data.allBooks.flatMap(book => book.genres);
  const genres = [...new Set(allGenres)];

  return (
    <div>
      <h2>books</h2>
      <div>
          <div>
            <p>in genre <strong>{selectedGenre || "All"}</strong></p>
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>author</th>
                  <th>published</th>
                </tr>
                {result.data.allBooks.map((b) => (
                  <tr key={b.title}>
                    <td>{b.title}</td>
                    <td>{b.author.name}</td>
                    <td>{b.published}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
      <div>
        <button onClick={() => setSelectedGenre("")}>All</button>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)} >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
