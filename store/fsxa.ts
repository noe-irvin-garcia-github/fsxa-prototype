import { getFSXAModule, FSXAApi } from 'fsxa-pattern-library'
import axios from 'axios'

const { getters, mutations, actions, state } = getFSXAModule(
  new FSXAApi(axios, {
    apiKey: 'f5a14f78-d8b8-4525-a814-63b49e0436ee',
    caas:
      'https://caas.staging.delivery-platform.e-spirit.live/0b975076-5061-44e6-bbce-c1d9f73f6606/preview.content',
    navigationService:
      'https://do-caas-core02.navigation.prod.delivery-platform.e-spirit.live/navigation/preview.0b975076-5061-44e6-bbce-c1d9f73f6606',
    locale: 'de_DE'
  })
)

export { getters, mutations, actions, state }
