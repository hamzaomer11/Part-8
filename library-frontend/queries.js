import { gql } from "@apollo/client";

export const ALL_BOOKS = gql`
  query bookByGenre($genre: String!) {
    allBooks (genre: $genre){
      title
      author {
        name
        born
      }
      published
      genres
    }
  }
`

export const NEW_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author {
        name
        born
      }
      published
      genres
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const EDIT_BIRTHYEAR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, born: $born) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
export const ME = gql`
  query {
    me {
      username
      id
      favouriteGenre
    }
  }
`

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
      born
    }
    published
    genres
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`