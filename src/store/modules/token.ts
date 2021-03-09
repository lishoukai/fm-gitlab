import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { SET_USERNAME, SET_PASSWORD, TOKEN_TYPE} from '../mutation-types';

interface IUserState {
  userName: string;
  password: string;
  tokenType: Number;
}

const userState: IUserState = {
  userName: '',
  password: '',
  tokenType: 0,
};

const getters: GetterTree<any, any> = {

};

const actions: ActionTree<any, any> = {
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
    console.log(0);
  },
};

export default {
  // namespaced: true, // 让 mutations、getters、actions 也按照模块划分
  state: userState,
  getters,
  actions,
  mutations,
};
