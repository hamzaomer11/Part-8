import { useQuery } from '@apollo/client'
import {ME, ALL_BOOKS} from '../../queries'

const Recommend = () => {

    const result = useQuery(ALL_BOOKS)
    
    const user = useQuery(ME, {
        skip: !window.localStorage.getItem('library-user-token')
    })

    if (result.loading || user.loading) {
        return <div>loading...</div>
    }

    const userFavouriteGenre = user.data?.me.favouriteGenre

    const recommendedBooks = result.data.allBooks.filter(books => 
        books.genres.includes(userFavouriteGenre))

    return (
        <div>
          <h2>recommendations</h2>
          <div>
            <div>
                <p>books in your favourite genre <strong>{user.data?.me.favouriteGenre}</strong> </p>
                <table>
                  <tbody>
                    <tr>
                      <th></th>
                      <th>author</th>
                      <th>published</th>
                    </tr>
                      {recommendedBooks.map((books) => (
                        <tr key={books.title}>
                        <td>{books.title}</td>
                        <td>{books.author.name}</td>
                        <td>{books.published}</td>
                      </tr>
                      ))}
                  </tbody>
                </table>
            </div>
          </div>
        </div>
      )
}

export default Recommend