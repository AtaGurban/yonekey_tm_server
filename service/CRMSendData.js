const CRMurl = 'https://yonekey.com/forms/wtl/218d83799b99f55a89892c6fd9d12130'
const axios = require('axios')

const sendData = async(item)=>{
    const {data} = await axios.post(CRMurl, item)
    return data
}

module.exports = {
    sendData,
  };
  