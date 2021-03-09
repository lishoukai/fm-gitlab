import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { SET_USERNAME, SET_PASSWORD, TOKEN_TYPE } from '../mutation-types';

interface IUserState {
  userName: string;
  password: string;
  tokenType: string;
}

const userState: IUserState = {
  userName: '',
  password: '',
  tokenType: '',
};

const getters: GetterTree<any, any> = {

};

const actions: ActionTree<any, any> = {
  // login({ commit }, params: { userName: string; password: string }) {
  //   return new Promise((resolve, reject) => {
  //     login(params).then((response) => {
  //       commit(SET_USERNAME, params.userName);
  //       commit(SET_PASSWORD, params.password);
  //       resolve(response);
  //     }).catch((err) => reject(err));
  //   });
  // },
};

const mutations: MutationTree<any> = {
  [SET_USERNAME](state, userName) {
    state.userName = userName;
  },

  [SET_PASSWORD](state, password) {
    state.password = password;
  },
  [TOKEN_TYPE](state, token) {
    state.tokenType = token;
  },
};

export default {
  // namespaced: true, // 让 mutations、getters、actions 也按照模块划分
  state: userState,
  getters,
  actions,
  mutations,
};
