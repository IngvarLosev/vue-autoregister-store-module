import config from '@libs/api_config';
import axios from 'axios';

export default {
    namespaced: true,
    state: {
        i18n_data: require('../../libs/messages/i18message.json'),
        default_component: '',
        current_component: '',
        language: 'uk-UA',
        sidebar_state: true,
        max_selected_indicators: 12,
        headerOptions: {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        },
    },
    actions: {
        resetToken() {
            localStorage.setItem('token', '');
            window.location.href = 'http://' + window.location.host + '/login';
        },
        getApiData({ state, dispatch }, params) {
            const tmpHeaderOptions = JSON.parse(JSON.stringify(state.headerOptions));
            const method = params.method || 'post';
            
            switch (method) {
                case 'post':
                    return axios[ method ](`${config.api_link}/${params.url}`, params.data, tmpHeaderOptions).catch(e => { dispatch('resetToken'); });
                case 'get':
                    return axios[ method ](`${config.api_link}/${params.url}`, tmpHeaderOptions).catch(e => { dispatch('resetToken'); });
            }
        },
        resetCurrentComponent({ commit, state }) { commit('setCurrentComponent', state.default_component); }
    },
    getters: {
        i18n: (state) => (value, cat = "interface") => {
            let strValue = value || '';
            if (!state.i18n_data.hasOwnProperty(state.language) || !state.i18n_data[ state.language ][ cat ].hasOwnProperty(strValue.toUpperCase())) {
                return strValue;
            }
            return state.i18n_data[ state.language ][ cat ][ strValue.toUpperCase() ];
        },
        language_index: (state) => {
            const mapToLangIndex = {
                'uk-UA': 0,
                'ru-RU': 1,
                'en-EN': 2
            };
            return mapToLangIndex[ state.language ];
        },
        language_code: (state) => {
            const mapToLangIndex = {
                'uk-UA': 'ua',
                'ru-RU': 'ru',
                'en-EN': 'en'
            };
            return mapToLangIndex[ state.language ];
        },
        parseLangTitle: (state, getters) => (title) => {return title.split('|')[ getters[ 'language_index' ] ] || title;}
        
    },
    mutations: {
        setMaxSelectedIndicators(state, value) {state.max_selected_indicators = value;},
        setSideBarState(state, value) { state.sidebar_state = value; },
        setCurrentComponent(state, value) { state.current_component = value; },
        setDefaultComponent(state, value) { state.default_component = value; },
        setLanguage(state, language) { state.language = language; }
    }
};
