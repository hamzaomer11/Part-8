import { useState } from "react"
import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../../queries"

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState("All")

  const result = useQuery(ALL_BOOKS)
  console.log(result)

  if (result.loading) {
    return <div>loading...</div>
  }

  const allGenres = result.data.allBooks.flatMap(book => book.genres);
  const genres = ["All", ...new Set(allGenres)];

  const filteredBooks = selectedGenre === "All"
    ? result.data.allBooks
    : result.data.allBooks.filter(books => 
      books.genres.includes(selectedGenre));

  return (
    <div>
      <h2>books</h2>
      <div>
        {filteredBooks.length > 0 && (
          <div>
            <p>in genre <strong>{selectedGenre}</strong></p>
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>author</th>
                  <th>published</th>
                </tr>
                {filteredBooks.map((b) => (
                  <tr key={b.title}>
                    <td>{b.title}</td>
                    <td>{b.author.name}</td>
                    <td>{b.published}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div>
        {genres.map((genre) => (
            <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
          ))}
      </div>
    </div>
  )
}

export default Books
