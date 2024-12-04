const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
    Query: {
      authorCount: async () => Author.collection.countDocuments(),
      bookCount: async () => Book.collection.countDocuments(),
      allBooks: async (root, args) => {
        let booksFiltered = Book.find({})
  
        if (args.author) {
          const authorFound = await Author.findOne({name: args.author})
          if (authorFound) {
            return Book.find({author: authorFound._id})
          }
          return []
        }
  
        if (args.genre) {
          const genreFound = await Book.find({genres: args.genre})
          return genreFound
        }
        return booksFiltered
      },
      allAuthors: async () => Author.find({}),
      me: (root, args, context) => {
        return context.currentUser
      },
    },
    Author: {
      bookCount: async (root) => {
        const booksByAuthor = await Book.countDocuments({author: root._id})
        return booksByAuthor
      }
    },
    Book: {
      author: async (root) => {
        return Author.findById(root.author)
      }
    },
    Mutation: {
      addBook: async (root, args, context) => {
        const currentUser = context.currentUser
  
        if (!currentUser) {
          throw new GraphQLError('user not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
  
        try {
          let authorInDb = await Author.findOne({name: args.author})
        
        if (!authorInDb) {
          authorInDb = new Author({name: args.author})
          await authorInDb.save()
        }
  
        const book = new Book({
          title: args.title,
          author: authorInDb._id,
          published: args.published,
          genres: args.genres
        })
  
        await book.save()

        pubsub.publish('BOOK_ADDED', { bookAdded: book })
  
        return book.populate('author')
        } catch (error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error
            }
          })
        }
      },
      editAuthor: async (root, args, context) => {
        const currentUser = context.currentUser
  
        if (!currentUser) {
          throw new GraphQLError('user not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
  
        let authorFound = await Author.findOne({name: args.name})
        if (!authorFound) {
          return null
        }
  
        authorFound.born = args.born
        await authorFound.save()
        return authorFound
      },
      createUser: async (root, args) => {
        if (!args.username || !args.favouriteGenre) {
          throw new GraphQLError('missing username and/or favouriteGenre!', {
            invalidArgs: args,
          })
        }
  
        const user = new User({ username: args.username,
          favouriteGenre: args.favouriteGenre })
    
        return user.save()
          .catch(error => {
            throw new GraphQLError('Creating the user failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args,
                error
              }
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
    
        if ( !user || args.password !== 'secret' ) {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })        
        }
    
        const userForToken = {
          username: user.username,
          id: user._id,
        }
    
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      }
    },
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
      },
    }
}

module.exports = resolvers