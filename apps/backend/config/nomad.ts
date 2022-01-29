import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

export const nomad = axios.create({
  baseURL: 'http://95.216.223.146:4646/v1',
  headers: {
    'X-Nomad-Token': Env.get('NOMAD_TOKEN'),
  },
})
