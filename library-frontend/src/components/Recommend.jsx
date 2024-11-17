import { useQuery } from '@apollo/client'
import {ME} from '../../queries'

const Recommend = () => {

    const user = useQuery(ME)
    console.log(user)
}

export default Recommend