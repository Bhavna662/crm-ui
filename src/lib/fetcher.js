import axios from 'axios'
axios.defaults.baseURL = "http://localhost:8080"

const fetcher = async (url)=>{
    try {
       const {data} = await axios.get(url)
       return data
    }
    catch(err) 
    {
        throw new Error(err)
    }
}

export default fetcher