import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_URL

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
